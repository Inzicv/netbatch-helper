import { drizzle } from "drizzle-orm/libsql";
import { createClient } from "@libsql/client";
import * as schema from "@/database/schema";

const url = process.env.TURSO_DATABASE_URL;
const authToken = process.env.TURSO_AUTH_TOKEN;

if (!url) {
    throw new Error("TURSO_DATABASE_URL is not defined. Please define it in your environment variables.");
}

export const client = createClient({
    url,
    authToken,
});

export const db = drizzle(client, { schema });
