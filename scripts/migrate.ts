import * as fs from "fs";
import * as path from "path";
import { config } from "dotenv";
import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import { sql } from "drizzle-orm";
import * as schema from "../database/schema";
import { jobs as jobsTable } from "../database/schema";

// Load environment variables
config();
config({ path: ".env.local" });

const databaseUrl = process.env.TURSO_DATABASE_URL;
const authToken = process.env.TURSO_AUTH_TOKEN;

if (!databaseUrl) {
    console.error("Error: TURSO_DATABASE_URL is not set in env.");
    process.exit(1);
}

const client = createClient({
    url: databaseUrl,
    authToken: authToken,
});

const db = drizzle(client, { schema });

async function runMigration() {
    console.log("Starting database migration from JSON to SQLite/Turso...");

    const dbDir = path.join(process.cwd(), "database");
    const jobsPath = path.join(dbDir, "jobs.json");

    if (!fs.existsSync(jobsPath)) {
        console.error(`Error: Source JSON file not found at ${jobsPath}`);
        process.exit(1);
    }

    const fileContent = fs.readFileSync(jobsPath, "utf-8");
    const jobsData = JSON.parse(fileContent);

    const jobEntries = Object.entries(jobsData);
    console.log(`Found ${jobEntries.length} jobs to migrate.`);

    // Insert in batches of 100 to avoid SQLite limits
    const batchSize = 100;
    for (let i = 0; i < jobEntries.length; i += batchSize) {
        const batch = jobEntries.slice(i, i + batchSize);
        const valuesToInsert = batch.map(([key, job]: [string, any]) => {
            return {
                id: key,
                system: job.system,
                monitor: job.monitor,
                jobName: job.job_name,
                jobNumber: job.job_number,
                obeyForm: job.obey_form,
                parameters: job.parameters,
            };
        });

        await db.insert(jobsTable)
            .values(valuesToInsert)
            .onConflictDoUpdate({
                target: jobsTable.id,
                set: {
                    system: sql`excluded.system`,
                    monitor: sql`excluded.monitor`,
                    jobName: sql`excluded.job_name`,
                    jobNumber: sql`excluded.job_number`,
                    obeyForm: sql`excluded.obey_form`,
                    parameters: sql`excluded.parameters`,
                }
            });

        console.log(`Migrated ${Math.min(i + batchSize, jobEntries.length)} / ${jobEntries.length} jobs...`);
    }

    console.log("Migration completed successfully!");
    client.close();
}

runMigration().catch((err) => {
    console.error("Migration failed:", err);
    process.exit(1);
});
