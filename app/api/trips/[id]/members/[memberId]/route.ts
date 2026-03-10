import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/lib/prisma";

export async function DELETE(req: Request, { params }: { params: any }) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id, memberId } = await params;
    const tripId = parseInt(id);
    const targetUserId = parseInt(memberId);
    const authUserId = parseInt(session.user.id);

    // Security: ensure the logged-in user is the organizer
    const trip = await prisma.trip.findUnique({
      where: { id: tripId },
    });

    if (!trip || trip.organizerId !== authUserId) {
      return NextResponse.json({ error: "Unauthorized to manage this trip" }, { status: 403 });
    }

    if (targetUserId === authUserId) {
        return NextResponse.json({ error: "You cannot remove yourself from your own trip" }, { status: 400 });
    }

    await prisma.tripMember.delete({
      where: {
        tripId_userId: {
          tripId,
          userId: targetUserId
        }
      }
    });

    return NextResponse.json({ message: "Member removed successfully" });

  } catch (error: any) {
    if (error.code === 'P2025') {
       return NextResponse.json({ error: "Member not found" }, { status: 404 });
    }
    console.error("REMOVE_MEMBER_ERROR:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
