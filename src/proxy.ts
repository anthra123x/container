import { auth } from "@/lib/auth"
import { NextResponse } from "next/server"

export default auth((req) => {
  const { pathname } = req.nextUrl
  const isLoggedIn = !!req.auth
  const role = req.auth?.user?.role

  if (pathname.startsWith("/login") && isLoggedIn) {
    return NextResponse.redirect(new URL("/admin", req.url))
  }

  if (pathname.startsWith("/admin")) {
    if (!isLoggedIn) {
      const loginUrl = new URL("/login", req.url)
      loginUrl.searchParams.set("callbackUrl", pathname)
      return NextResponse.redirect(loginUrl)
    }

    if (pathname === "/admin" || pathname === "/admin/") {
      return NextResponse.next()
    }

    const adminOnlyPaths = ["/admin/usuarios", "/admin/configuracion"]
    if (adminOnlyPaths.some((p) => pathname.startsWith(p)) && role !== "SUPER_ADMIN" && role !== "ADMIN") {
      return NextResponse.redirect(new URL("/admin", req.url))
    }
  }

  return NextResponse.next()
})

export const config = {
  matcher: ["/admin/:path*", "/login"],
}
