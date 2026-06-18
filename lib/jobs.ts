import jobsData from "@/database/jobs.json";
import { Job, JobsDatabase } from "@/lib/types";

const jobs = jobsData as JobsDatabase;

export function getAllJobs(): Job[] {

    return Object.values(jobs);

}

export function getJob(jobKey: string): Job | undefined {

    return jobs[jobKey];

}

export function getJobByName(jobName: string): Job | undefined {

    return Object.values(jobs).find(

        (job) => job.job_name === jobName

    );

}