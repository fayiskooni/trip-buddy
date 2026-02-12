
import NextAuth, { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import prisma from "@/lib/prisma";
import { createSession } from "@/lib/auth";

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === "google") {
        try {
          if (!user.email) return false;

          const dbUser = await prisma.user.upsert({
            where: { email: user.email },
            update: { name: user.name },
            create: {
              email: user.email,
              name: user.name,
              password: "", // Google users don't have a password
            },
          });

          await createSession(dbUser.id.toString());
          return true;
        } catch (error) {
          console.error("Error signing in with Google:", error);
          return false;
        }
      }
      return true;
    },
    async redirect({ url, baseUrl }) {
       return baseUrl + "/home";
    },
  },
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
