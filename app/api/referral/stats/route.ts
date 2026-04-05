import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await auth();
    const { userId: clerkId } = session;

    if (!clerkId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 1. Get User ID & Code from Prisma
    const user = await (prisma.user as any).findUnique({
      where: { clerkId } as any,
      select: { id: true, referralCode: true } as any
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // 2. Fetch Clicks (ReferralVisit)
    const clicks = await (prisma as any).referralVisit.count({
      where: { referrerId: user.id }
    });

    // 3. Fetch Pending (Referred users who haven't paid)
    const pending = await prisma.user.count({
      where: {
        referredById: user.id,
        isPaid: false
      } as any
    });

    // 4. Fetch Converted (Referred users who have paid)
    const converted = await prisma.user.count({
      where: {
        referredById: user.id,
        isPaid: true
      } as any
    });

    // 5. Total Earnings
    const rewards = await (prisma as any).referralReward.aggregate({
      where: { referrerId: user.id },
      _sum: { amount: true }
    });

    return NextResponse.json({
      clicks: clicks || 0,
      pending: pending || 0,
      converted: converted || 0,
      earnings: rewards._sum.amount || 0,
      referralCode: (user as any).referralCode
    });
  } catch (error) {
    console.error("[REFERRAL_STATS_ERROR]", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
