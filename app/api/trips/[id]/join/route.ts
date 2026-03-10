import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/lib/prisma";

export async function POST(req: Request, { params }: { params: any }) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const tripId = parseInt(id);
    const userId = parseInt(session.user.id);

    // Verify trip exists and check participant limits
    const trip = await prisma.trip.findUnique({
      where: { id: tripId },
      include: {
        _count: {
          select: { members: true }
        }
      }
    });

    if (!trip) {
      return NextResponse.json({ error: "Trip not found" }, { status: 404 });
    }

    if (trip.organizerId === userId) {
      return NextResponse.json({ error: "Organizers cannot join their own trip" }, { status: 400 });
    }

    if (trip._count.members >= trip.maxParticipants) {
      return NextResponse.json({ error: "This trip is fully booked" }, { status: 400 });
    }

    // Upsert or create membership (if they cancelled previously, we might just update status, but for now we create)
    const membership = await prisma.tripMember.create({
      data: {
        tripId,
        userId,
        status: "APPROVED" // Auto-approve for now based on user flow
      }
    });

    return NextResponse.json({ message: "Successfully joined trip", membership });
  } catch (error: any) {
    if (error.code === 'P2002') {
      return NextResponse.json({ error: "You have already joined this trip." }, { status: 400 });
    }
    console.error("JOIN_TRIP_ERROR:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
