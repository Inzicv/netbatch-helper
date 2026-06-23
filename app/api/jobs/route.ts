import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";
import { Job, JobsDatabase } from "@/lib/types";

const dbDir = path.join(process.cwd(), "database");
const jobsPath = path.join(dbDir, "jobs.json");
const nameIndexPath = path.join(dbDir, "name_index.json");
const numberIndexPath = path.join(dbDir, "number_index.json");

// Helper to rebuild indexes from jobs database
function rebuildIndexes(jobs: JobsDatabase) {
    const nameIndex: Record<string, string[]> = {};
    const numberIndex: Record<string, string> = {};

    for (const [jobKey, job] of Object.entries(jobs)) {
        // Name index
        const name = job.job_name.toUpperCase();
        if (!nameIndex[name]) {
            nameIndex[name] = [];
        }
        if (!nameIndex[name].includes(jobKey)) {
            nameIndex[name].push(jobKey);
        }

        // Number index
        if (job.job_number !== null && job.job_number !== undefined) {
            const numKey = `${job.system}.${job.monitor}.${job.job_number}`;
            numberIndex[numKey] = jobKey;
        }
    }

    return { nameIndex, numberIndex };
}

// GET all jobs
export async function GET() {
    try {
        const fileContent = await fs.readFile(jobsPath, "utf-8");
        const jobs = JSON.parse(fileContent) as JobsDatabase;
        return NextResponse.json(jobs);
    } catch {
        return NextResponse.json({ error: "Failed to read database" }, { status: 500 });
    }
}

// POST/PUT to save/modify/add a job
export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { oldJobKey, job }: { oldJobKey: string | null; job: Job } = body;

        const fileContent = await fs.readFile(jobsPath, "utf-8");
        const jobs = JSON.parse(fileContent) as JobsDatabase;

        const newJobKey = `${job.system}.${job.monitor}.${job.job_name}`;

        // If job key changed, delete the old key
        if (oldJobKey && oldJobKey !== newJobKey) {
            delete jobs[oldJobKey];
        }

        // Save the job
        jobs[newJobKey] = job;

        // Rebuild indexes
        const { nameIndex, numberIndex } = rebuildIndexes(jobs);

        // Write files to disk
        await fs.writeFile(jobsPath, JSON.stringify(jobs, null, 4), "utf-8");
        await fs.writeFile(nameIndexPath, JSON.stringify(nameIndex, null, 4), "utf-8");
        await fs.writeFile(numberIndexPath, JSON.stringify(numberIndex, null, 4), "utf-8");

        return NextResponse.json({ success: true, jobKey: newJobKey, jobs });
    } catch {
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

        const fileContent = await fs.readFile(jobsPath, "utf-8");
        const jobs = JSON.parse(fileContent) as JobsDatabase;

        if (jobKey in jobs) {
            delete jobs[jobKey];
        }

        // Rebuild indexes
        const { nameIndex, numberIndex } = rebuildIndexes(jobs);

        // Write files to disk
        await fs.writeFile(jobsPath, JSON.stringify(jobs, null, 4), "utf-8");
        await fs.writeFile(nameIndexPath, JSON.stringify(nameIndex, null, 4), "utf-8");
        await fs.writeFile(numberIndexPath, JSON.stringify(numberIndex, null, 4), "utf-8");

        return NextResponse.json({ success: true, jobs });
    } catch {
        return NextResponse.json({ error: "Failed to delete job" }, { status: 500 });
    }
}
