import { NextResponse } from "next/server";

export function middleware(request) {
  const role = request.cookies.get("userRole")?.value;
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/admin") && role !== "admin") {
    return NextResponse.redirect(new URL("/", request.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
