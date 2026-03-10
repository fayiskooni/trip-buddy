import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/lib/prisma";

export async function PATCH(req: Request, { params }: { params: any }) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const tripId = parseInt(id);
    const userId = parseInt(session.user.id);

    // Verify ownership
    const existingTrip = await prisma.trip.findUnique({
      where: { id: tripId },
      select: { organizerId: true }
    });

    if (!existingTrip) {
      return NextResponse.json({ error: "Trip not found" }, { status: 404 });
    }

    if (existingTrip.organizerId !== userId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { title, description, maxParticipants, imageUrl } = await req.json();

    const updateData: any = {
      ...(title && { title }),
      ...(description && { description }),
      ...(maxParticipants && { maxParticipants: parseInt(maxParticipants) })
    };

    if (imageUrl !== undefined) {
      const finalImageUrl = imageUrl.trim();
      await prisma.tripImage.deleteMany({ where: { tripId } });
      
      if (finalImageUrl) {
        updateData.images = {
          create: {
            imageUrl: finalImageUrl
          }
        };
      }
    }

    const updatedTrip = await prisma.trip.update({
      where: { id: tripId },
      data: updateData
    });

    return NextResponse.json({ message: "Trip updated successfully", trip: updatedTrip });
  } catch (error) {
    console.error("UPDATE_TRIP_ERROR:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: any }) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const tripId = parseInt(id);
    const userId = parseInt(session.user.id);

    // Verify ownership
    const existingTrip = await prisma.trip.findUnique({
      where: { id: tripId },
      select: { organizerId: true }
    });

    if (!existingTrip) {
      return NextResponse.json({ error: "Trip not found" }, { status: 404 });
    }

    if (existingTrip.organizerId !== userId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Since members, bookings, reviews, images, etc. might have relations, 
    // Prisma will cascade delete if configured. Let's make sure it handles it or we manually delete dependencies.
    // The safest way is to do transactions or let Prisma handle it if onDelete: Cascade is present.
    // TripImage doesn't explicitly say Cascade in schema (wait, let's check schema: trip Trip @relation(fields: [tripId], references: [id]) without onDelete).
    // Let's delete related manually first to avoid relation errors if cascade isn't set.
    
    await prisma.$transaction([
      prisma.tripImage.deleteMany({ where: { tripId } }),
      prisma.tripMember.deleteMany({ where: { tripId } }),
      prisma.booking.deleteMany({ where: { tripId } }),
      prisma.review.deleteMany({ where: { tripId } }),
      prisma.savedTrip.deleteMany({ where: { tripId } }),
      prisma.message.deleteMany({ where: { tripId } }),
      prisma.trip.delete({ where: { id: tripId } })
    ]);

    return NextResponse.json({ message: "Trip deleted successfully" });
  } catch (error) {
    console.error("DELETE_TRIP_ERROR:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
