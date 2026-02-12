import { NextRequest, NextResponse } from "next/server";
import { decrypt } from "@/lib/session";

const protectedRoutes = ["/home", "/create-trip", "/profile"];
const publicRoutes = ["/login", "/sign-up", "/"];

export default async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;
  
  // Skip middleware for API routes (especially NextAuth)
  if (path.startsWith("/api")) {
    return NextResponse.next();
  }
  
  const isProtectedRoute = !publicRoutes.includes(path);
  const isPublicRoute = publicRoutes.includes(path);

  const cookie = req.cookies.get("session")?.value;
  const session = await decrypt(cookie);

  // Redirect to /login if the user is not authenticated and trying to access a protected route
  if (isProtectedRoute && !session?.userId) {
    return NextResponse.redirect(new URL("/login", req.nextUrl));
  }

  // Redirect to /home if the user is authenticated and trying to access a public route (like login or sign-up)
  if (
    isPublicRoute &&
    session?.userId &&
    !req.nextUrl.pathname.startsWith("/home") &&
    req.nextUrl.pathname !== "/"
  ) {
    // If they are on /login or /sign-up and logged in, send to /home
    if (path === "/login" || path === "/sign-up") {
       return NextResponse.redirect(new URL("/home", req.nextUrl));
    }
  }

  return NextResponse.next();
}

// Routes Middleware should not run on
export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
};
