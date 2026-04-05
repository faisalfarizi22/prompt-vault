import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";

export async function POST(req: NextRequest) {
  try {
    const { code, fingerprint } = await req.json();

    if (!code) {
      return NextResponse.json({ error: "Missing referral code" }, { status: 400 });
    }

    // Resolve Code to Internal ID
    const referrer = await prisma.user.findUnique({
      where: { referralCode: code } as any,
      select: { id: true }
    });

    if (!referrer) {
      return NextResponse.json({ error: "Invalid referral code" }, { status: 404 });
    }

    const headerList = await headers();
    const ip = headerList.get("x-forwarded-for") || "unknown";
    const userAgent = headerList.get("user-agent") || "unknown";

    // Anti-Spam: Prevent multiple rapid logs from same IP/Fingerprint
    // For now, simpler logging
    const db = prisma as any;
    await db.referralVisit.create({
      data: {
        referrerId: (referrer as any).id,
        ipAddress: ip,
        deviceFingerprint: fingerprint,
        userAgent,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[REFERRAL_TRACK_ERROR]", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
