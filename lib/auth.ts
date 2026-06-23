import crypto from "crypto";

const SESSION_SECRET = process.env.SESSION_SECRET || "default_session_secret_change_me_in_prod_netbatch_123!";
const SESSION_DURATION = 24 * 60 * 60 * 1000; // 24 heures

export function createSessionToken(username: string): string {
    const expiresAt = Date.now() + SESSION_DURATION;
    const payload = `${username}:${expiresAt}`;
    const signature = crypto
        .createHmac("sha256", SESSION_SECRET)
        .update(payload)
        .digest("hex");
    return `${payload}:${signature}`;
}

export function verifySessionToken(token: string): string | null {
    if (!token) return null;
    
    try {
        const parts = token.split(":");
        if (parts.length !== 3) return null;
        
        const [username, expiresAtStr, signature] = parts;
        const expiresAt = parseInt(expiresAtStr, 10);
        
        if (isNaN(expiresAt) || expiresAt < Date.now()) {
            return null; // Expiré
        }

        const payload = `${username}:${expiresAt}`;
        const expectedSignature = crypto
            .createHmac("sha256", SESSION_SECRET)
            .update(payload)
            .digest("hex");

        if (signature === expectedSignature) {
            return username;
        }
    } catch {
        return null;
    }
    
    return null;
}
