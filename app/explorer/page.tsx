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

import { translateEvery } from "@/lib/every";
import { getNextRun } from "@/lib/next-run";
import { Job } from "@/lib/types";
import { useDatabase } from "@/components/database-context";
import { PanelLeftClose, PanelLeft } from "lucide-react";

export default function ExplorerPage() {

    const { searchJobs, loading } = useDatabase();

    const [search, setSearch] = useState("");

    const [sidebarOpen, setSidebarOpen] = useState(true);

    const [selectedMonitors, setSelectedMonitors] = useState([

        "$ZBAP",

        "$ZBAT",

        "$ZBAD"

    ]);

    const [selectedSystems, setSelectedSystems] = useState([

        "ATLAS",

        "PADME",

        "ISIS",

        "LEIA"

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

                job => selectedMonitors.includes(job.monitor) &&

                       selectedSystems.includes(job.system)

            );

    },

        [

            search,

            selectedMonitors,

            selectedSystems,

            searchJobs

        ]

    );

    const currentJob = selectedJob || results[0] || null;

    const waitFor = currentJob?.parameters["WAITON"]

        ?.split(",")

        .map(

            x => x.trim()

        )

        .filter(Boolean)

        || [];

    const blockedByThis = currentJob?.parameters["AFTER"]

        ?.split(",")

        .map(

            x => x.trim()

        )

        .filter(Boolean)

        || [];

    if (loading) {
        return (
            <div className="h-screen bg-[#09090b] text-white flex items-center justify-center">
                <div className="text-center space-y-4">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-violet-500 mx-auto"></div>
                    <div className="text-zinc-400">Chargement de la base de données...</div>
                </div>
            </div>
        );
    }

    return (

        <div className="h-screen overflow-hidden bg-[#09090b] text-white">

            <Header />

            <div className="flex h-[calc(100vh-96px)] w-full gap-6 p-6 overflow-hidden flex-col lg:flex-row">

                {sidebarOpen && (

                    <div className="flex w-full lg:w-[380px] shrink-0 flex-col gap-6 overflow-y-auto pr-1">

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

                            <div className="mt-6 border-t border-zinc-800 pt-6">
                                <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider block mb-3">Système</span>
                                <div className="grid grid-cols-2 gap-2">
                                    {["ATLAS", "PADME", "ISIS", "LEIA"].map((sys) => {
                                        const selected = selectedSystems.includes(sys);
                                        return (
                                            <button
                                                key={sys}
                                                onClick={() => {
                                                    if (selectedSystems.includes(sys)) {
                                                        setSelectedSystems(selectedSystems.filter(s => s !== sys));
                                                    } else {
                                                        setSelectedSystems([...selectedSystems, sys]);
                                                    }
                                                }}
                                                className={`rounded-xl py-2 px-3 text-xs font-semibold border transition-all ${
                                                    selected
                                                        ? "bg-violet-600/10 border-violet-500/50 text-violet-300"
                                                        : "bg-[#161619] border-zinc-800 text-zinc-500 hover:text-zinc-300"
                                                }`}
                                            >
                                                {sys}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                        </div>

                        <div className="flex-1 space-y-4 overflow-y-auto pr-2">

                            {

                                results.map(

                                    (job) => (

                                        <JobCard

                                            key={`${job.system}.${job.monitor}.${job.job_name}`}

                                            selected={

                                                currentJob?.job_name === job.job_name &&
                                                currentJob?.monitor === job.monitor &&
                                                currentJob?.system === job.system

                                            }

                                            jobName={job.job_name}

                                            script={

                                                job.parameters["SET IN"] || ""

                                            }

                                            user={

                                                job.parameters["==CHANGEUSER"] || ""

                                            }

                                            monitor={job.monitor}

                                            system={job.system}

                                            onClick={() =>

                                                setSelectedJob(job)

                                            }

                                        />

                                    )

                                )

                            }

                        </div>

                    </div>

                )}

                <div className="flex-1 overflow-y-auto pr-2">

                    <div className="flex items-center gap-4 mb-4">
                        <button
                            onClick={() => setSidebarOpen(!sidebarOpen)}
                            className="rounded-lg p-2 text-zinc-400 hover:bg-zinc-900 hover:text-white transition-all"
                            title={sidebarOpen ? "Masquer la liste" : "Afficher la liste"}
                        >
                            {sidebarOpen ? <PanelLeftClose className="h-5 w-5" /> : <PanelLeft className="h-5 w-5" />}
                        </button>
                    </div>

                    {

                        currentJob && (

                            <div className="space-y-8">

                                <HeaderCard

                                    jobName={currentJob.job_name}

                                    monitor={currentJob.monitor}

                                    system={currentJob.system}

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

                                        nextRun={getNextRun(currentJob.parameters["SET EVERY"] || "")}

                                    />

                                </div>

                                <DependencyCard

                                    waitFor={waitFor}
                                    setWaitFor={() => { }}

                                    after={blockedByThis}
                                    setAfter={() => { }}

                                    readOnly={true}

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