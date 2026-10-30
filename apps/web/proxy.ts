import { updateSession } from "@shared/lib/supabase";
import type { NextRequest, NextResponse } from "next/server";

export function proxy(request: NextRequest): Promise<NextResponse> {
  // Always overwrite incoming values; only the actual URL selects a profile.
  request.headers.set("x-profile-path", request.nextUrl.pathname);
  return updateSession(request);
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
