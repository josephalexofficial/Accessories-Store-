import NextAuth from "next-auth";
import { NextResponse } from "next/server";
import { authConfig } from "@/auth.config";

const { auth } = NextAuth(authConfig);

function sameHostRedirect(req: Request, pathname: string) {
  // Always derive from the incoming request — never AUTH_URL/localhost.
  const url = new URL(req.url);
  url.pathname = pathname;
  url.search = "";
  url.hash = "";
  return NextResponse.redirect(url);
}

export default auth((req) => {
  const isAdminRoute = req.nextUrl.pathname.startsWith("/admin");
  const isLoginPage = req.nextUrl.pathname === "/admin";
  const isLoggedIn = !!req.auth;

  if (isAdminRoute && !isLoginPage && !isLoggedIn) {
    return sameHostRedirect(req, "/admin");
  }

  if (isLoginPage && isLoggedIn) {
    return sameHostRedirect(req, "/admin/dashboard");
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/admin", "/admin/:path*"],
};
