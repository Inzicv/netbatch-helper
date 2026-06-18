"use client";

import { useMemo, useState } from "react";

import Header from "@/components/header";
import SearchBar from "@/components/search-bar";
import MonitorFilters from "@/components/monitor-filters";
import JobCard from "@/components/job-card";
import HeaderCard from "@/components/header-card";
import ConfigCard from "@/components/config-card";
import PlanningCard from "@/components/planning-card";
import DependencyCard from "@/components/dependency-card";
import ObeyCard from "@/components/obey-card";

import { searchJobs } from "@/lib/search";
import { translateEvery } from "@/lib/every";
import { Job } from "@/lib/types";

export default function ExplorerPage() {

    const [search, setSearch] = useState("");

    const [selectedMonitors, setSelectedMonitors] = useState([
        "$ZBAP",
        "$ZBAT",
        "$ZBAD"
    ]);

    const [selectedJob, setSelectedJob] = useState<Job | null>(null);

    function toggleMonitor(monitor: string) {

        if (selectedMonitors.includes(monitor)) {

            setSelectedMonitors(

                selectedMonitors.filter(

                    m => m !== monitor

                )

            );

        }

        else {

            setSelectedMonitors(

                [

                    ...selectedMonitors,

                    monitor

                ]

            );

        }

    }

    const results = useMemo(() => {

        return searchJobs(search)

            .filter(

                job => selectedMonitors.includes(

                    job.monitor

                )

            );

    }, [

        search,

        selectedMonitors

    ]);

    const currentJob = selectedJob || results[0] || null;

    const waitFor = currentJob?.parameters["WAITON"]

        ?.split(",")

        .map(x => x.trim())

        .filter(Boolean)

        || [];

    const blockedByThis = currentJob?.parameters["AFTER"]

        ?.split(",")

        .map(x => x.trim())

        .filter(Boolean)

        || [];

    return (

        <div className="h-screen overflow-hidden bg-[#09090b] text-white">

            <Header />

            <div className="mx-auto flex h-[calc(100vh-112px)] max-w-[1800px] gap-8 p-8">

                {/* Sidebar */}

                <div className="flex w-[400px] flex-col gap-6">

                    <div className="rounded-3xl border border-zinc-800 bg-[#111113] p-6">

                        <SearchBar

                            value={search}

                            onChange={setSearch}

                        />

                        <div className="mt-6">

                            <MonitorFilters

                                selectedMonitors={selectedMonitors}

                                toggleMonitor={toggleMonitor}

                            />

                        </div>

                    </div>

                    <div className="flex-1 space-y-4 overflow-y-auto pr-2">

                        {

                            results.map(

                                (job) => (

                                    <JobCard

                                        key={`${job.monitor}_${job.job_name}`}

                                        selected={

                                            currentJob?.job_name === job.job_name

                                        }

                                        jobName={job.job_name}

                                        script={

                                            job.parameters["SET IN"] || ""

                                        }

                                        user={

                                            job.parameters["==CHANGEUSER"] || ""

                                        }

                                        monitor={job.monitor}

                                        onClick={() =>

                                            setSelectedJob(job)

                                        }

                                    />

                                )

                            )

                        }

                    </div>

                </div>

                {/* Partie droite */}

                <div className="flex-1 overflow-y-auto pr-2">

                    {

                        currentJob && (

                            <div className="space-y-8">

                                <HeaderCard

                                    jobName={currentJob.job_name}

                                    monitor={currentJob.monitor}

                                    jobNumber={currentJob.job_number || 0}

                                    user={

                                        currentJob.parameters["==CHANGEUSER"] || ""

                                    }

                                    description={

                                        currentJob.parameters["SET DESCRIPTION"] || ""

                                    }

                                />

                                <div className="grid grid-cols-2 gap-8">

                                    <ConfigCard

                                        volume={

                                            currentJob.parameters["SET VOLUME"] || ""

                                        }

                                        scriptIn={

                                            currentJob.parameters["SET IN"] || ""

                                        }

                                        output={

                                            currentJob.parameters["SET OUT"] || ""

                                        }

                                        executor={

                                            currentJob.parameters["SET EXECUTOR-PROGRAM"] || ""

                                        }

                                        stopOnAbend={

                                            currentJob.parameters["SET STOP-ON-ABEND"] || ""

                                        }

                                    />

                                    <PlanningCard

                                        every={

                                            currentJob.parameters["SET EVERY"] || ""

                                        }

                                        translation={

                                            translateEvery(

                                                currentJob.parameters["SET EVERY"] || ""

                                            )

                                        }

                                        nextRun="-"

                                    />

                                </div>

                                <DependencyCard

                                    waitFor={waitFor}

                                    blockedByThis={blockedByThis}

                                />

                                <ObeyCard

                                    obey={currentJob.obey_form}

                                />

                            </div>

                        )

                    }

                </div>

            </div>

        </div>

    );

}