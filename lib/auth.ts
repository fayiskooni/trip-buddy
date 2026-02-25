import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { encrypt, decrypt } from "@/lib/session";
import prisma from "./prisma";

export { encrypt, decrypt };

export async function createSession(userId: string) {
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  const session = await encrypt({ userId, expiresAt });

  (await cookies()).set("session", session, {
    httpOnly: true,
    secure: true,
    expires: expiresAt,
    sameSite: "lax",
    path: "/",
  });
}

export async function deleteSession() {
  (await cookies()).delete("session");
}

export async function verifySession() {
  const cookie = (await cookies()).get("session")?.value;
  const session = await decrypt(cookie);

  if (!session?.userId) {
    redirect("/login");
  }

  const idNum = Number(session.userId);

  if (isNaN(idNum)) {
    redirect("/login?clearSession=true");
  }

  const user = await prisma.user.findUnique({
    where: { id: idNum },
    select: { id: true },
  });

  if (!user) {
    redirect("/login?clearSession=true");
  }

  return { isAuth: true, userId: Number(session.userId) };
}
