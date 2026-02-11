import { auth } from "@/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const { pathname } = req.nextUrl;

  const protectedPaths = ["/posts/new"];
  const isProtected =
    protectedPaths.some((path) => pathname.startsWith(path)) ||
    /^\/posts\/[^/]+\/edit$/.test(pathname);

  if (isProtected && !req.auth?.user) {
    return NextResponse.redirect(new URL("/auth/signin", req.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};
