import { auth, currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";

// Helper to generate a 5-character alphanumeric code
async function generateUniqueReferralCode(): Promise<string> {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // Removed ambiguous O, I, 0, 1
  let code = "";
  let isUnique = false;
  let attempts = 0;

  while (!isUnique && attempts < 10) {
    code = "";
    for (let i = 0; i < 5; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }

    // Check uniqueness in DB
    const existing = await prisma.user.findUnique({
      where: { referralCode: code } as any
    });

    if (!existing) {
      isUnique = true;
    }
    attempts++;
  }
  return code;
}

export async function POST(req: Request) {
  try {
    const session = await auth();
    const { userId: clerkId } = session;

    if (!clerkId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { referrerId, fingerprint } = await req.json();
    const headerList = await headers();
    const ip = headerList.get("x-forwarded-for") || "unknown";

    // 1. Get user details from Clerk (if we need email/name)
    const clerkUser = await currentUser();
    const email = clerkUser?.emailAddresses[0]?.emailAddress || "";
    const name = clerkUser?.fullName || "";
    const isPaid = clerkUser?.publicMetadata?.isPaid === true;

    // Resolve referredById if it's a referral code
    let actualReferredById = null;
    if (referrerId) {
      const referrerUser = await (prisma.user as any).findFirst({
        where: {
          OR: [
            { id: referrerId },
            { referralCode: referrerId }
          ]
        }
      });
      if (referrerUser) {
        actualReferredById = referrerUser.id;
      }
    }

    // 2. Check if user already exists and has a referral code
    const existingUser = await (prisma.user as any).findUnique({
      where: { clerkId } as any,
      select: { referralCode: true } as any
    });

    let referralCode = (existingUser as any)?.referralCode;
    if (!referralCode) {
      referralCode = await generateUniqueReferralCode();
    }

    // 3. Upsert User (Ensure they exist in Prisma)
    const user = await (prisma.user as any).upsert({
      where: { clerkId } as any,
      update: {
        referralCode, // Update or keep existing
        isPaid // Sync payment state if changed externally before sync
      } as any,
      create: {
        clerkId,
        email,
        name,
        isPaid,
        registrationIp: ip,
        deviceFingerprint: fingerprint,
        referredById: actualReferredById,
        referralCode,
      } as any
    });

    return NextResponse.json({ 
      success: true, 
      userId: user.id,
      referralCode: (user as any).referralCode 
    });
  } catch (error) {
    console.error("[USER_SYNC_ERROR]", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
