import { getJobByName } from "@/lib/jobs";
import { searchJobs } from "@/lib/search";
import { Job } from "@/lib/types";

export async function loadJobModel(query: string): Promise<Job | undefined> {
    if (!query) {
        return undefined;
    }

    const exact = await getJobByName(query.toUpperCase());

    if (exact) {
        return exact;
    }

    const results = await searchJobs(query);

    if (results.length > 0) {
        return results[0];
    }

    return undefined;
}