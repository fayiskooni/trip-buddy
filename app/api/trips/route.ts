import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { 
      title, 
      description, 
      destination, 
      category, 
      tripType, 
      pricePerPerson, 
      maxParticipants, 
      startDate, 
      endDate,
      imageUrl 
    } = body;

    // Validate required fields
    if (!title || !description || !destination || !category || !tripType || !maxParticipants || !startDate || !endDate) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const userId = parseInt(session.user.id);

    // Automatically generate an image based on destination or title if not provided
    const finalImageUrl = imageUrl || `https://loremflickr.com/800/600/${encodeURIComponent(destination || title || 'travel')}`;

    // Create the trip and update user role in a transaction
    const [trip, updatedUser] = await prisma.$transaction([
      prisma.trip.create({
        data: {
          title,
          description,
          destination,
          category,
          tripType,
          pricePerPerson: tripType === "PAID" ? parseFloat(pricePerPerson) : null,
          currency: "INR",
          maxParticipants: parseInt(maxParticipants),
          startDate: new Date(startDate),
          endDate: new Date(endDate),
          organizerId: userId,
          status: "APPROVED", // Auto-approving for now, could be DRAFT
          images: {
            create: {
              imageUrl: finalImageUrl
            }
          }
        },
        include: {
          images: true,
        }
      }),
      // Upgrade the user to ORGANIZER role if they are creating a trip
      prisma.user.update({
        where: { id: userId },
        data: { role: "ORGANIZER" }
      })
    ]);

    return NextResponse.json({
      message: "Trip created successfully",
      trip,
      updatedUser,
    });
  } catch (error) {
    console.error("CREATE_TRIP_ERROR: ", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const trips = await prisma.trip.findMany({
      where: {
        status: "APPROVED"
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

    // Transform data slightly to make frontend consumption easier
    const formattedTrips = trips.map(trip => ({
      ...trip,
      joinedCount: trip._count.members,
      coverImage: trip.images[0]?.imageUrl || `https://loremflickr.com/800/600/${encodeURIComponent(trip.destination || trip.title || 'travel')}`
    }));

    return NextResponse.json(formattedTrips);
  } catch (error) {
    console.error("GET_TRIPS_ERROR: ", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}