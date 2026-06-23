import { NextResponse } from "next/server";
import { createSessionToken, verifyPassword } from "@/lib/auth";

export async function POST(request: Request) {
    try {
        const { username, password } = await request.json();
        const normalizedUsername = (username || "").toLowerCase();

        // Stored password hashes (salt:hash) - default fallbacks are cryptographically hashed default passwords
        const adminHash = process.env.AUTH_ADMIN_HASH || "113b5422bc460c5a80fd37d4b4330475:c0b7c5e845ac626cc2eb5b22f37ecd4f5c1ba454543a0079790afdfc20654cc4b44006199871dda38d750902e88de780e880883b22545d1830d9ed64cb0fb9f5";
        const vincentHash = process.env.AUTH_VINCENT_HASH || "961449157f7c39bef4c67dc2edbfefdf:5e26694dd66869cc2d236d3314512356a02d5244ee275159319e47c589af2989db3a9ae2b94e572103996252625d1092a811afe3612f55f1ae21c379519bac82";
        const olivierHash = process.env.AUTH_OLIVIER_HASH || "7f4f67f63038161d93e1563ff58947ad:404b7f02cd686621fe483544fc9d00801cf05325bc7794c18e81a8f69f7e014ad3370a0bae53c80d2b728d365679db5982cfa232f129bb1e36aa503e8ca3bdb3";

        let isValid = false;
        if (normalizedUsername === "admin") {
            isValid = verifyPassword(password, adminHash);
        } else if (normalizedUsername === "vincent") {
            isValid = verifyPassword(password, vincentHash);
        } else if (normalizedUsername === "olivier") {
            isValid = verifyPassword(password, olivierHash);
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
