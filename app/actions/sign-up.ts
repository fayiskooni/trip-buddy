"use server";

import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import bcrypt from "bcryptjs";
import { createSession } from "@/lib/auth";

export async function createAccount(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const name = formData.get("name") as string;

  if (!email || !password) {
    throw new Error("Email and password are required");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        fullName: name,
      },
    });
    
    await createSession(user.id.toString());
  } catch (error) {
    console.error("Failed to create account:", error);
    throw new Error("Failed to create account. Email might already be in use.");
  }
  redirect("/");
}
