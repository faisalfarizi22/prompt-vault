import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const session = await auth();
    const { userId: clerkId } = session;
    
    if (!clerkId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 1. Verify User & Paid Status
    const user = await prisma.user.findUnique({
      where: { clerkId },
      select: { id: true, isPaid: true }
    });

    if (!user || !user.isPaid) {
      return NextResponse.json({ error: "Hanya pengguna Pro yang dapat mengirimkan partisipasi." }, { status: 403 });
    }

    // 2. Parse Body
    const { platform, videoUrl, username } = await req.json();

    if (!platform || !videoUrl || !username) {
      return NextResponse.json({ error: "Semua field wajib diisi." }, { status: 400 });
    }

    // 3. Save Submission
    const submission = await (prisma as any).challengeSubmission.create({
      data: {
        userId: user.id,
        platform,
        videoUrl,
        username,
        status: "PENDING"
      }
    });

    return NextResponse.json({ success: true, submissionId: submission.id });
  } catch (error) {
    console.error("[CAMPAIGN_SUBMIT_ERROR]", error);
    return NextResponse.json({ error: "Terjadi kesalahan pada server." }, { status: 500 });
  }
}
