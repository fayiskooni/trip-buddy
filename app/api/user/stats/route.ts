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

    const [organizedTripsCount, joinedTripsCount] = await Promise.all([
      prisma.trip.count({
        where: { organizerId: userId },
      }),
      prisma.tripMember.count({
        where: { userId: userId },
      }),
    ]);

    return NextResponse.json({
      organizedTrips: organizedTripsCount,
      joinedTrips: joinedTripsCount,
    });
  } catch (error) {
    console.error("USER_STATS_ERROR: ", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
