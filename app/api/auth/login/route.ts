import { NextResponse } from "next/server";
import { createSessionToken } from "@/lib/auth";

export async function POST(request: Request) {
    try {
        const { username, password } = await request.json();
        const normalizedUsername = (username || "").toLowerCase();

        // Get passwords from environment or fallback to legacy defaults
        const adminPass = process.env.AUTH_ADMIN_PASSWORD || "HPN0nSt0p!14";
        const vincentPass = process.env.AUTH_VINCENT_PASSWORD || "HPN0nSt0p!13";
        const olivierPass = process.env.AUTH_OLIVIER_PASSWORD || "HPN0nSt0p!08";

        let isValid = false;
        if (normalizedUsername === "admin" && password === adminPass) {
            isValid = true;
        } else if (normalizedUsername === "vincent" && password === vincentPass) {
            isValid = true;
        } else if (normalizedUsername === "olivier" && password === olivierPass) {
            isValid = true;
        }

        if (!isValid) {
            return NextResponse.json({ error: "Identifiants incorrects" }, { status: 401 });
        }

        const token = createSessionToken(normalizedUsername);
        const response = NextResponse.json({ success: true, username: normalizedUsername });

        // Set secure HTTP-only cookie
        response.cookies.set({
            name: "netbatch_session",
            value: token,
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            path: "/",
            maxAge: 60 * 60 * 24, // 24 hours
        });

        return response;
    } catch (error) {
        return NextResponse.json({ error: "Une erreur est survenue" }, { status: 500 });
    }
}
