import jobsData from "@/database/jobs.json";
import nameIndexData from "@/database/name_index.json";
import numberIndexData from "@/database/number_index.json";

import { Job, JobsDatabase } from "@/lib/types";

const jobs = jobsData as JobsDatabase;

const nameIndex = nameIndexData as Record<string, string[]>;

const numberIndex = numberIndexData as Record<string, string>;

export function searchJobs(query: string): Job[] {

    const search = query.trim().toUpperCase();

    if (!search) {

        return Object.values(jobs);

    }

    //
    // Recherche par numéro
    //

    if (/^\d+$/.test(search)) {

        for (const key of Object.keys(numberIndex)) {

            if (key.endsWith(`_${search}`)) {

                const jobKey = numberIndex[key];

                if (jobKey in jobs) {

                    return [jobs[jobKey]];

                }

            }

        }

    }

    //
    // Recherche exacte par nom
    //

    if (search in nameIndex) {

        return nameIndex[search]

            .filter((jobKey) => jobKey in jobs)

            .map((jobKey) => jobs[jobKey]);

    }

    //
    // Recherche full text
    //

    return Object.values(jobs).filter((job) => {

        const description = (

            job.parameters["SET DESCRIPTION"] || ""

        ).toUpperCase();

        const scriptIn = (

            job.parameters["SET IN"] || ""

        ).toUpperCase();

        const output = (

            job.parameters["SET OUT"] || ""

        ).toUpperCase();

        const user = (

            job.parameters["==CHANGEUSER"] || ""

        ).toUpperCase();

        const obey = job.obey_form.toUpperCase();

        return (

            job.job_name.toUpperCase().includes(search)

            ||

            description.includes(search)

            ||

            scriptIn.includes(search)

            ||

            output.includes(search)

            ||

            user.includes(search)

            ||

            obey.includes(search)

        );

    });

}