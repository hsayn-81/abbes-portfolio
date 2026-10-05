import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const adminSession = request.cookies.get("admin_session")?.value;
  const isLoggedIn = adminSession === "true";

  // 1. Shortcut: /login URL handling
  if (pathname === "/login") {
    if (isLoggedIn) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
    return NextResponse.redirect(new URL("/dashboard/login", request.url));
  }

  // 2. If logged in and tries to go to /dashboard/login -> Redirect to /dashboard
  if (pathname === "/dashboard/login" && isLoggedIn) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // 3. Guard /dashboard routes (except /dashboard/login)
  if (pathname.startsWith("/dashboard") && pathname !== "/dashboard/login") {
    if (!isLoggedIn) {
      return NextResponse.redirect(new URL("/dashboard/login", request.url));
    }
  }

  return NextResponse.next();
}

export default middleware;

export const config = {
  matcher: ["/dashboard/:path*", "/login"],
};