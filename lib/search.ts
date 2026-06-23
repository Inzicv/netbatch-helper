import { db } from "@/lib/db";
import { jobs } from "@/database/schema";
import { Job } from "@/lib/types";
import { eq, or, like } from "drizzle-orm";
import { getAllJobs } from "./jobs";

function toJob(row: any): Job {
    return {
        system: row.system,
        job_name: row.jobName,
        job_number: row.jobNumber,
        monitor: row.monitor,
        parameters: row.parameters,
        obey_form: row.obeyForm,
    };
}

export async function searchJobs(query: string): Promise<Job[]> {
    const search = query.trim().toUpperCase();

    if (!search) {
        return getAllJobs();
    }

    // 1. Recherche par numéro
    if (/^\d+$/.test(search)) {
        const num = parseInt(search, 10);
        const rows = await db.select().from(jobs).where(eq(jobs.jobNumber, num));
        if (rows.length > 0) {
            return rows.map(toJob);
        }
    }

    // 2. Recherche exacte par nom
    const exactRows = await db.select().from(jobs).where(eq(jobs.jobName, search));
    if (exactRows.length > 0) {
        return exactRows.map(toJob);
    }

    // 3. Recherche full text (LIKE sur nom, obey, et parameters JSON)
    const likePattern = `%${search}%`;
    const fullTextRows = await db.select().from(jobs).where(
        or(
            like(jobs.jobName, likePattern),
            like(jobs.obeyForm, likePattern),
            like(jobs.parameters, likePattern)
        )
    );

    return fullTextRows.map(toJob);
}