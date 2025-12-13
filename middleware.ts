import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { auth } from "@/auth";

// Public routes that don't require authentication
const publicRoutes = ["/login", "/register", "/forgot-password", "/reset-password"];

// Auth routes that redirect to dashboard if already logged in
const authRoutes = ["/login", "/register"];

// API auth prefix
const apiAuthPrefix = "/api/auth";

// Default redirect after login
const DEFAULT_LOGIN_REDIRECT = "/dashboard";

export default auth((req: { auth: any; nextUrl: NextRequest["nextUrl"] }) => {
  const { nextUrl } = req;
  // Check if user is actually logged in - verify session exists and has user data
  const isLoggedIn = !!req.auth && !!req.auth.user && !!req.auth.user.email;

  const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix);
  const isPublicRoute = publicRoutes.includes(nextUrl.pathname);
  const isAuthRoute = authRoutes.includes(nextUrl.pathname);

  // Allow API auth routes
  if (isApiAuthRoute) {
    return NextResponse.next();
  }

  // Redirect logged-in users away from auth pages
  if (isAuthRoute) {
    if (isLoggedIn) {
      return NextResponse.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl));
    }
    return NextResponse.next();
  }

  // Protect private routes - redirect to login if not authenticated
  if (!isLoggedIn && !isPublicRoute) {
    return NextResponse.redirect(new URL("/login", nextUrl));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};

