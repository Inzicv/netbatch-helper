"use client";

import React, { createContext, useContext, useEffect, useState, useMemo } from "react";
import { Job, JobsDatabase } from "@/lib/types";

interface DatabaseContextType {
    jobs: JobsDatabase;
    allJobs: Job[];
    loading: boolean;
    error: string | null;
    searchJobs: (query: string) => Job[];
    saveJob: (oldJobKey: string | null, job: Job) => Promise<string>;
    deleteJob: (jobKey: string) => Promise<void>;
}

const DatabaseContext = createContext<DatabaseContextType | undefined>(undefined);

export function DatabaseProvider({ children }: { children: React.ReactNode }) {
    const [jobs, setJobs] = useState<JobsDatabase>({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Load database on mount
    const fetchJobs = async () => {
        try {
            setLoading(true);
            const response = await fetch("/api/jobs");
            if (!response.ok) {
                throw new Error("Failed to load database");
            }
            const data = await response.json();
            setJobs(data);
            setError(null);
        } catch (err: unknown) {
            const errMsg = err instanceof Error ? err.message : "An error occurred";
            setError(errMsg);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        setTimeout(() => {
            fetchJobs();
        }, 0);
    }, []);

    const allJobs = useMemo(() => Object.values(jobs), [jobs]);

    // Rebuild index-like searches client-side dynamically
    const searchJobs = (query: string): Job[] => {
        const search = query.trim().toUpperCase();
        if (!search) {
            return allJobs;
        }

        // Search by Job Number
        if (/^\d+$/.test(search)) {
            const num = parseInt(search, 10);
            const found = allJobs.find(job => job.job_number === num);
            if (found) {
                return [found];
            }
        }

        // Search by exact name
        const exactMatches = allJobs.filter(job => job.job_name.toUpperCase() === search);
        if (exactMatches.length > 0) {
            return exactMatches;
        }

        // Full text search
        return allJobs.filter((job) => {
            const description = (job.parameters["SET DESCRIPTION"] || "").toUpperCase();
            const scriptIn = (job.parameters["SET IN"] || "").toUpperCase();
            const output = (job.parameters["SET OUT"] || "").toUpperCase();
            const user = (job.parameters["==CHANGEUSER"] || "").toUpperCase();
            const obey = (job.obey_form || "").toUpperCase();
            const monitor = (job.monitor || "").toUpperCase();

            return (
                job.job_name.toUpperCase().includes(search)
                || description.includes(search)
                || scriptIn.includes(search)
                || output.includes(search)
                || user.includes(search)
                || obey.includes(search)
                || monitor.includes(search)
            );
        });
    };

    // Save/Modify/Add a job
    const saveJob = async (oldJobKey: string | null, job: Job): Promise<string> => {
        const response = await fetch("/api/jobs", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ oldJobKey, job }),
        });

        if (!response.ok) {
            throw new Error("Failed to save job");
        }

        const data = await response.json();
        setJobs(data.jobs);
        return data.jobKey;
    };

    // Delete a job
    const deleteJob = async (jobKey: string): Promise<void> => {
        const response = await fetch(`/api/jobs?jobKey=${encodeURIComponent(jobKey)}`, {
            method: "DELETE",
        });

        if (!response.ok) {
            throw new Error("Failed to delete job");
        }

        const data = await response.json();
        setJobs(data.jobs);
    };

    return (
        <DatabaseContext.Provider value={{ jobs, allJobs, loading, error, searchJobs, saveJob, deleteJob }}>
            {children}
        </DatabaseContext.Provider>
    );
}

export function useDatabase() {
    const context = useContext(DatabaseContext);
    if (!context) {
        throw new Error("useDatabase must be used within a DatabaseProvider");
    }
    return context;
}
