import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/lib/prisma";

export async function PUT(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { bio, country } = body;

    if (!bio && !country) {
      return NextResponse.json(
        { error: "At least one field (bio or country) is required" },
        { status: 400 }
      );
    }

    const updatedUser = await prisma.user.update({
      where: {
        id: parseInt(session.user.id),
      },
      data: {
        bio: bio !== undefined ? bio : undefined,
        country: country !== undefined ? country : undefined,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        bio: true,
        country: true,
      },
    });

    return NextResponse.json({
      message: "Profile updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("ONBOARDING_UPDATE_ERROR: ", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
