import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"

const publicAdminRoutes = ["/admin/login"]

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl

  if (pathname.startsWith("/admin")) {
    if (publicAdminRoutes.some((route) => pathname.startsWith(route))) {
      return NextResponse.next()
    }

    if (pathname.startsWith("/api/auth")) {
      return NextResponse.next()
    }

    try {
      const session = await auth.api.getSession({
        headers: req.headers,
      })

      if (!session) {
        const loginUrl = new URL("/admin/login", req.url)
        return NextResponse.redirect(loginUrl)
      }
    } catch {
      // Auth unavailable (no DB) — allow access for development
      console.warn("Auth unavailable, allowing admin access without login.")
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/admin/:path*"],
}
