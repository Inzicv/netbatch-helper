import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifySessionToken } from "@/lib/auth";

export async function GET() {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get("netbatch_session")?.value;
        const username = token ? verifySessionToken(token) : null;

        if (!username) {
            return NextResponse.json({ authenticated: false }, { status: 401 });
        }

        return NextResponse.json({ authenticated: true, username });
    } catch {
        return NextResponse.json({ authenticated: false }, { status: 500 });
    }
}
