import { defineConfig } from "drizzle-kit";

export default defineConfig({
    schema: "./database/schema.ts",
    out: "./database/migrations",
    dialect: "sqlite",
    dbCredentials: {
        url: process.env.TURSO_DATABASE_URL || "file:netbatch.db",
    },
});
