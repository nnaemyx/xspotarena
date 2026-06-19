import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyAuth } from "@/lib/auth";

// Helper to check if pathname matches a path pattern (either exact or as a parent directory)
const matchesPath = (pattern: string, pathname: string) => 
  pathname === pattern || pathname.startsWith(pattern + "/");

// Add paths that don't require authentication (for all HTTP methods)
const publicAllMethodsPaths = [
  "/login",
  "/register",
  "/forgot-password",
  "/reset-password",
  "/verify-otp",
  "/products",
  "/blog",
  "/custom-jersey",
  "/api/auth/login",
  "/api/auth/register",
  "/api/auth/forgot-password",
  "/api/auth/reset-password",
  "/api/auth/verify-otp",
  "/api/webhook",
];

// Add paths that are public only for GET requests (e.g. read-only product catalog)
const publicGetPaths = [
  "/api/products",
  "/api/categories",
  "/api/blog",
];

// Add paths that require admin access
const adminPaths = [
  "/admin",
  "/dashboard",
  "/dashboard/users",
  "/dashboard/orders",
  "/dashboard/products",
  "/api/admin",
];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Allow access to public paths and static assets
  const isPublic = 
    pathname === "/" ||
    publicAllMethodsPaths.some(path => matchesPath(path, pathname)) ||
    (request.method === "GET" && publicGetPaths.some(path => matchesPath(path, pathname)));

  if (
    isPublic ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/static") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  // 2. Check for authentication token
  let token = request.headers.get("authorization")?.split(" ")[1];
  if (!token) {
    token = request.cookies.get("auth-token")?.value;
  }

  if (!token) {
    // For API routes, return 401
    if (pathname.startsWith("/api")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    // For page routes, redirect to login
    return NextResponse.redirect(new URL("/login", request.url));
  }

  try {
    const decoded = await verifyAuth(token);
    if (!decoded) {
      if (pathname.startsWith("/api")) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
      return NextResponse.redirect(new URL("/login", request.url));
    }
    
    // Add user info to request headers for use in API routes
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set("x-user-id", decoded.userId);
    requestHeaders.set("x-user-role", decoded.role);

    // 3. Check admin access for admin paths
    if (adminPaths.some(path => matchesPath(path, pathname)) && decoded.role !== "ADMIN") {
      if (pathname.startsWith("/api")) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
      }
      return NextResponse.redirect(new URL("/", request.url));
    }

    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
  } catch (error) {
    // If token is invalid, redirect to login / return 401
    if (pathname.startsWith("/api")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.redirect(new URL("/login", request.url));
  }
}

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
}; 