import { auth } from "@/lib/auth"
import { getRoleLevel } from "@/lib/validations/user"
import { NextResponse } from "next/server"

const AUTH_PAGES = ["/login", "/admin/login"]

export default auth((req) => {
  const { pathname } = req.nextUrl
  const isLoggedIn = !!req.auth
  const role = req.auth?.user?.role as string | undefined

  if (AUTH_PAGES.includes(pathname)) {
    if (isLoggedIn) {
      return NextResponse.redirect(new URL("/admin", req.url))
    }
    return NextResponse.next()
  }

  if (pathname.startsWith("/admin")) {
    if (!isLoggedIn) {
      const loginUrl = new URL("/admin/login", req.url)
      loginUrl.searchParams.set("callbackUrl", pathname)
      return NextResponse.redirect(loginUrl)
    }

    if (role && getRoleLevel(role) < 1) {
      return NextResponse.redirect(new URL("/", req.url))
    }
  }

  if (pathname === "/login" && isLoggedIn) {
    return NextResponse.redirect(new URL("/admin", req.url))
  }

  return NextResponse.next()
})

export const config = {
  matcher: ["/admin/:path*", "/login"],
}
