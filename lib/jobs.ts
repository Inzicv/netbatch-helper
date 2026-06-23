import { db } from "@/lib/db";
import { jobs } from "@/database/schema";
import { Job } from "@/lib/types";
import { eq } from "drizzle-orm";

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

export async function getAllJobs(): Promise<Job[]> {
    const rows = await db.select().from(jobs);
    return rows.map(toJob);
}

export async function getJob(jobKey: string): Promise<Job | undefined> {
    const [row] = await db.select().from(jobs).where(eq(jobs.id, jobKey)).limit(1);
    if (!row) return undefined;
    return toJob(row);
}

export async function getJobByName(jobName: string): Promise<Job | undefined> {
    // Note: Netbatch-helper can have multiple jobs with the same name across systems.
    // We return the first one found or undefined.
    const [row] = await db.select().from(jobs).where(eq(jobs.jobName, jobName)).limit(1);
    if (!row) return undefined;
    return toJob(row);
}