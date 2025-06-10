import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()

  // In demo mode, allow all dashboard access
  if (req.nextUrl.pathname.startsWith("/dashboard")) {
    // Simple demo routing - you can test all dashboards
    return res
  }

  return res
}

export const config = {
  matcher: ["/dashboard/:path*"],
}
