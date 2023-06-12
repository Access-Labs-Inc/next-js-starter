import { getToken } from "next-auth/jwt";
import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  async function middleware(req) {
    const token = await getToken({ req });
    const isAuth = !!token;

    const isAuthPage = req.nextUrl.pathname.startsWith("/login");
    if (isAuthPage) {
      if (isAuth) {
        return NextResponse.redirect(new URL("/protected", req.url));
      }

      return null;
    }

    const isProtectedPage =
      req.nextUrl.pathname.startsWith("/protected") ||
      req.nextUrl.pathname.startsWith("/locked")

    if (!isAuth && isProtectedPage) {
      let from = req.nextUrl.pathname;
      if (req.nextUrl.search) {
        from += req.nextUrl.search;
      }

      return NextResponse.redirect(
        new URL(`/login?from=${encodeURIComponent(from)}`, req.url)
      );
    }
  },
  {
    callbacks: {
      async authorized() {
        // This is a work-around for handling redirect on auth pages.
        // We return true here so that the middleware function above
        // is always called.
        return true;
      },
    },
  }
);

export const config = {
  matcher: ["/((?!api|_next/image|_next/static|assets|favicon.ico|site.webmanifest|sw.js).*)"],
};
