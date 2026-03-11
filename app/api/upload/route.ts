import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { v4 as uuidv4 } from "uuid";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json(
        { error: "No file uploaded" },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Get the file extension
    const originalName = file.name;
    const extension = originalName.substring(originalName.lastIndexOf("."));
    
    // Generate a unique filename
    const uniqueFilename = `${uuidv4()}${extension}`;

    // Define the upload directory and the final path
    const uploadDir = join(process.cwd(), "public", "uploads");
    const filePath = join(uploadDir, uniqueFilename);

    // Ensure the uploads directory exists
    try {
      await mkdir(uploadDir, { recursive: true });
    } catch (err) {
      // Ignore if directory already exists
    }

    // Write the file to the local filesystem
    await writeFile(filePath, buffer);

    // Return the relative URL (accessible from the frontend)
    const imageUrl = `/uploads/${uniqueFilename}`;

    return NextResponse.json({ 
      message: "File uploaded successfully",
      imageUrl 
    });
  } catch (error) {
    console.error("UPLOAD_ERROR: ", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
