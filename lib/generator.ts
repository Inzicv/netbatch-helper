import { getJobByName } from "@/lib/jobs";
import { searchJobs } from "@/lib/search";
import { Job } from "@/lib/types";

export function loadJobModel(query: string): Job | undefined {

    if (!query) {

        return undefined;

    }

    const exact = getJobByName(query.toUpperCase());

    if (exact) {

        return exact;

    }

    const results = searchJobs(query);

    if (results.length > 0) {

        return results[0];

    }

    return undefined;

}