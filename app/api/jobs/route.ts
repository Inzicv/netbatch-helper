import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { jobs } from "@/database/schema";
import { Job, JobsDatabase } from "@/lib/types";
import { eq } from "drizzle-orm";

// Helper to construct JobsDatabase object from rows
function buildJobsDatabase(rows: any[]): JobsDatabase {
    const jobsDb: JobsDatabase = {};
    for (const row of rows) {
        jobsDb[row.id] = {
            system: row.system,
            job_name: row.jobName,
            job_number: row.jobNumber,
            monitor: row.monitor,
            parameters: row.parameters,
            obey_form: row.obeyForm,
        };
    }
    return jobsDb;
}

// GET all jobs
export async function GET() {
    try {
        const rows = await db.select().from(jobs);
        return NextResponse.json(buildJobsDatabase(rows));
    } catch (error) {
        console.error("GET /api/jobs failed:", error);
        return NextResponse.json({ error: "Failed to read database" }, { status: 500 });
    }
}

// POST/PUT to save/modify/add a job
export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { oldJobKey, job }: { oldJobKey: string | null; job: Job } = body;

        const newJobKey = `${job.system}.${job.monitor}.${job.job_name}`;

        // If job key changed, delete the old key
        if (oldJobKey && oldJobKey !== newJobKey) {
            await db.delete(jobs).where(eq(jobs.id, oldJobKey));
        }

        // Save the job (upsert)
        await db.insert(jobs).values({
            id: newJobKey,
            system: job.system,
            monitor: job.monitor,
            jobName: job.job_name,
            jobNumber: job.job_number,
            obeyForm: job.obey_form,
            parameters: job.parameters,
        }).onConflictDoUpdate({
            target: jobs.id,
            set: {
                system: job.system,
                monitor: job.monitor,
                jobName: job.job_name,
                jobNumber: job.job_number,
                obeyForm: job.obey_form,
                parameters: job.parameters,
            }
        });

        // Fetch all jobs to return updated database
        const rows = await db.select().from(jobs);
        const updatedDb = buildJobsDatabase(rows);

        return NextResponse.json({ success: true, jobKey: newJobKey, jobs: updatedDb });
    } catch (error) {
        console.error("POST /api/jobs failed:", error);
        return NextResponse.json({ error: "Failed to save job" }, { status: 500 });
    }
}

// DELETE to remove a job
export async function DELETE(request: Request) {
    try {
        const url = new URL(request.url);
        const jobKey = url.searchParams.get("jobKey");

        if (!jobKey) {
            return NextResponse.json({ error: "Missing jobKey" }, { status: 400 });
        }

        await db.delete(jobs).where(eq(jobs.id, jobKey));

        // Fetch all jobs to return updated database
        const rows = await db.select().from(jobs);
        const updatedDb = buildJobsDatabase(rows);

        return NextResponse.json({ success: true, jobs: updatedDb });
    } catch (error) {
        console.error("DELETE /api/jobs failed:", error);
        return NextResponse.json({ error: "Failed to delete job" }, { status: 500 });
    }
}
