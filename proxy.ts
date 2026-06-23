import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifySessionToken } from "@/lib/auth";

export function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Exclude static assets and public assets
    if (
        pathname.startsWith("/_next") ||
        pathname.startsWith("/static") ||
        pathname === "/favicon.ico"
    ) {
        return NextResponse.next();
    }

    const token = request.cookies.get("netbatch_session")?.value;
    const username = token ? verifySessionToken(token) : null;

    // Redirect unauthenticated users trying to access app pages
    if (!username && pathname !== "/login") {
        if (pathname.startsWith("/api/")) {
            return new NextResponse(
                JSON.stringify({ error: "Session expirée ou non valide" }),
                { status: 401, headers: { "Content-Type": "application/json" } }
            );
        }
        const loginUrl = new URL("/login", request.url);
        return NextResponse.redirect(loginUrl);
    }

    // Redirect authenticated users trying to access login page
    if (username && pathname === "/login") {
        const explorerUrl = new URL("/explorer", request.url);
        return NextResponse.redirect(explorerUrl);
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        /*
         * Match all paths except:
         * 1. /api/auth/* (Authentication APIs)
         * 2. /favicon.ico, _next/static, _next/image (Static files)
         */
        "/((?!api/auth|_next/static|_next/image|favicon.ico).*)",
    ],
};
