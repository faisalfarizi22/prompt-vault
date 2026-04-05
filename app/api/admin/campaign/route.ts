import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Use the same admin secret logic as the password API
const ADMIN_SECRET = process.env.ADMIN_SECRET || "VELOPROME_ADMIN_2025";

function verifyAdmin(req: Request) {
  const secretHeader = req.headers.get("x-admin-secret");
  return secretHeader === ADMIN_SECRET;
}

export async function GET(req: Request) {
  if (!verifyAdmin(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const submissions = await prisma.challengeSubmission.findMany({
      include: {
        user: {
          select: {
            name: true,
            email: true,
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json({ submissions });
  } catch (error) {
    console.error("[ADMIN_CAMPAIGN_GET]", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  if (!verifyAdmin(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id, views, status } = await req.json();

    if (!id) {
      return NextResponse.json({ error: "Submission ID is required" }, { status: 400 });
    }

    const updated = await prisma.challengeSubmission.update({
      where: { id },
      data: {
        views: typeof views === 'number' ? views : undefined,
        status: status ? status : undefined,
      }
    });

    return NextResponse.json({ success: true, submission: updated });
  } catch (error) {
    console.error("[ADMIN_CAMPAIGN_PUT]", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
