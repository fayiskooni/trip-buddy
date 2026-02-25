import { NextRequest, NextResponse } from "next/server";
import { decrypt } from "@/lib/session";

const protectedRoutes = ["/", "/create-trip", "/profile"];
const publicRoutes = ["/login", "/sign-up"];

export default async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;
  
  // Skip middleware for API routes (especially NextAuth)
  if (path.startsWith("/api")) {
    return NextResponse.next();
  }

  if (req.nextUrl.searchParams.get("clearSession") === "true") {
    const res = NextResponse.redirect(new URL("/login", req.nextUrl));
    res.cookies.delete("session");
    return res;
  }
  
  const isProtectedRoute = protectedRoutes.includes(path) || (!publicRoutes.includes(path) && path !== "/how-it-works");
  const isPublicRoute = publicRoutes.includes(path);

  const cookie = req.cookies.get("session")?.value;
  const session = await decrypt(cookie);

  // Redirect to /login if the user is not authenticated and trying to access a protected route
  if (isProtectedRoute && !session?.userId) {
    return NextResponse.redirect(new URL("/login", req.nextUrl));
  }

  // Redirect to / if the user is authenticated and trying to access a public route
  if (isPublicRoute && session?.userId) {
    return NextResponse.redirect(new URL("/", req.nextUrl));
  }

  return NextResponse.next();
}

// Routes Middleware should not run on
export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
};
