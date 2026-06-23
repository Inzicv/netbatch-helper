import { defineConfig } from "drizzle-kit";
import { config } from "dotenv";

// Load dotenv to resolve env variables in CLI config
config();
config({ path: ".env.local" });

const url = process.env.TURSO_DATABASE_URL || "file:netbatch.db";
const authToken = process.env.TURSO_AUTH_TOKEN;

export default defineConfig({
    schema: "./database/schema.ts",
    out: "./database/migrations",
    dialect: "turso",
    dbCredentials: {
        url,
        authToken,
    },
});
