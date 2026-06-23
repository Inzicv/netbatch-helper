export interface JobParameters {
    [key: string]: string;
}

export interface Job {

    system: string;

    job_name: string;

    job_number: number | null;

    monitor: string;

    parameters: JobParameters;

    obey_form: string;
}

export interface JobsDatabase {

    [key: string]: Job;

}