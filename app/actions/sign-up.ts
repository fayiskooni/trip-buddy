"use server";

import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import bcrypt from "bcryptjs";

export async function createAccount(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const name = formData.get("name") as string;

  if (!email || !password) {
    throw new Error("Email and password are required");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
      },
    });
  } catch (error) {
    console.error("Failed to create account:", error);
    throw new Error("Failed to create account. Email might already be in use.");
  }
  redirect("/home");
}
