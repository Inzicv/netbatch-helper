import { drizzle } from "drizzle-orm/libsql";
import { createClient } from "@libsql/client";
import * as schema from "@/database/schema";

// Fallback to local sqlite file if env is not defined (prevents build-time crashes)
const url = process.env.TURSO_DATABASE_URL || "file:netbatch.db";
const authToken = process.env.TURSO_AUTH_TOKEN;

export const client = createClient({
    url,
    authToken,
});

export const db = drizzle(client, { schema });
