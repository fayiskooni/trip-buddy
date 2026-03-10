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
    const authUserId = parseInt(session.user.id);

    // Security: ensure the logged-in user is the organizer
    const trip = await prisma.trip.findUnique({
      where: { id: tripId },
      include: { _count: { select: { members: true } } }
    });

    if (!trip || trip.organizerId !== authUserId) {
      return NextResponse.json({ error: "Unauthorized to manage this trip" }, { status: 403 });
    }

    if (trip._count.members >= trip.maxParticipants) {
      return NextResponse.json({ error: "This trip is fully booked" }, { status: 400 });
    }

    const { name, email, phone } = await req.json();

    if (!email || !name) {
      return NextResponse.json({ error: "Name and email are required to add a member" }, { status: 400 });
    }

    // Upsert a guest user record based on email
    let user = await prisma.user.findUnique({ where: { email } });
    
    if (!user) {
      user = await prisma.user.create({
        data: {
          name,
          email,
          phone,
          role: "TRAVELER",
        }
      });
    } else {
      // Update missing info if it's a new input
      user = await prisma.user.update({
        where: { id: user.id },
        data: {
          name: user.name || name,
          phone: user.phone || phone,
        }
      });
    }

    // Make them a member
    const membership = await prisma.tripMember.create({
      data: {
        tripId,
        userId: user.id,
        status: "APPROVED"
      }
    });

    return NextResponse.json({ message: "Successfully added new member manually", membership });

  } catch (error: any) {
    if (error.code === 'P2002') {
      return NextResponse.json({ error: "This user is already a member of the trip." }, { status: 400 });
    }
    console.error("ADD_MEMBER_ERROR:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
