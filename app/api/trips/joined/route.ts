import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = parseInt(session.user.id);

    const trips = await prisma.trip.findMany({
      where: {
        members: {
          some: {
            userId: userId
          }
        }
      },
      include: {
        images: true,
        organizer: {
          select: {
            name: true,
            image: true,
          }
        },
        _count: {
          select: { members: true }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    const formattedTrips = trips.map(trip => ({
      ...trip,
      joinedCount: trip._count.members,
      coverImage: trip.images[0]?.imageUrl || null
    }));

    return NextResponse.json(formattedTrips);
  } catch (error) {
    console.error("GET_JOINED_TRIPS_ERROR: ", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
