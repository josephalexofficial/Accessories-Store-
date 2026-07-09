import NextAuth from "next-auth";
import { NextResponse } from "next/server";
import { authConfig } from "@/auth.config";

const { auth } = NextAuth(authConfig);

export default auth((req) => {
  const isAdminRoute = req.nextUrl.pathname.startsWith("/admin");
  const isLoginPage = req.nextUrl.pathname === "/admin";
  const isLoggedIn = !!req.auth;

  if (isAdminRoute && !isLoginPage && !isLoggedIn) {
    return NextResponse.redirect(new URL("/admin", req.url));
  }

  if (isLoginPage && isLoggedIn) {
    return NextResponse.redirect(new URL("/admin/dashboard", req.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/admin", "/admin/:path*"],
};
