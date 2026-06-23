"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

import Header from "@/components/header";

import ModelCard from "@/components/generator/model-card";
import ConfigurationCard from "@/components/generator/configuration-card";
import EveryCard from "@/components/generator/every-card";
import DependencyCard from "@/components/dependency-card";
import PreviewCard from "@/components/generator/preview-card";

import { buildObey } from "@/lib/build-obey";
import { Job } from "@/lib/types";
import { useDatabase } from "@/components/database-context";

export default function GeneratorPage() {

    const { jobs, searchJobs, loading } = useDatabase();

    const [loadedModel, setLoadedModel] = useState<Job | null>(null);

    const [jobName, setJobName] = useState("");

    const [volume, setVolume] = useState("");

    const [scriptIn, setScriptIn] = useState("");

    const [output, setOutput] = useState("");

    const [executor, setExecutor] = useState("");

    const [hold, setHold] = useState(true);

    const [stopOnAbend, setStopOnAbend] = useState(true);

    const [changeUser, setChangeUser] = useState("");

    const [every, setEvery] = useState("");

    const [waitFor, setWaitFor] = useState<string[]>([]);

    const [after, setAfter] = useState<string[]>([]);

    const [matchingJobs, setMatchingJobs] = useState<Job[]>([]);

    const loadSpecificJob = useCallback((job: Job) => {

        setLoadedModel(job);

        setJobName(

            job.job_name

        );

        setVolume(

            job.parameters["SET VOLUME"] || ""

        );

        setScriptIn(

            job.parameters["SET IN"] || ""

        );

        setOutput(

            job.parameters["SET OUT"] || ""

        );

        setExecutor(

            job.parameters["SET EXECUTOR-PROGRAM"] || ""

        );

        setHold(

            (job.parameters["SET HOLD"] || "").toUpperCase() === "ON"

        );

        setStopOnAbend(

            (job.parameters["SET STOP-ON-ABEND"] || "").toUpperCase() === "ON"

        );

        setChangeUser(

            job.parameters["==CHANGEUSER"] || ""

        );

        setEvery(

            job.parameters["SET EVERY"] || ""

        );

        setWaitFor(

            job.parameters["WAITON"]

                ? job.parameters["WAITON"]

                    .split(",")

                    .map(

                        x => x.trim()

                    )

                : []

        );

        setAfter(

            job.parameters["AFTER"]

                ? job.parameters["AFTER"]

                    .split(",")

                    .map(

                        x => x.trim()

                    )

                : []

        );

        setMatchingJobs([]);

    }, []);

    const loadModel = useCallback((system?: string | null, monitor?: string | null, query?: string | null) => {

        if (!query) return;

        const upperQuery = query.toUpperCase();

        // If system and monitor are both provided, search exact match
        if (system && monitor) {
            const exactKey = `${system}.${monitor}.${upperQuery}`;
            const job = jobs[exactKey];
            if (job) {
                loadSpecificJob(job);
                return;
            }
        }

        // Search by exact name
        const results = searchJobs(query).filter(j => j.job_name.toUpperCase() === upperQuery);

        if (results.length === 1) {

            loadSpecificJob(results[0]);

        } else if (results.length > 1) {

            setMatchingJobs(results);

        } else {

            // General query fallback (broad searchJobs matching)
            const broad = searchJobs(query);

            if (broad.length === 1) {

                loadSpecificJob(broad[0]);

            } else if (broad.length > 1) {

                setMatchingJobs(broad);

            }

        }

    }, [jobs, searchJobs, loadSpecificJob]);

    useEffect(() => {
        if (typeof window !== "undefined") {
            const params = new URLSearchParams(window.location.search);
            const modelName = params.get("model");
            const system = params.get("system");
            const monitor = params.get("monitor");
            if (modelName) {
                setTimeout(() => {
                    loadModel(system, monitor, modelName);
                }, 0);
            }
        }
    }, [loadModel]);

    const obey = useMemo(() => {

        if (!loadedModel) {
            return `ASSUME JOB\n\nRESET\n\nSET VOLUME ${volume}\n\nSET IN ${scriptIn}\n\nSET OUT ${output}\n\nSET EXECUTOR-PROGRAM ${executor}\n\nSET EVERY ${every}\n\nSET HOLD ${hold ? "ON" : "OFF"}\n\nSET STOP-ON-ABEND ${stopOnAbend ? "ON" : "OFF"}\n\n${waitFor.filter(Boolean).length > 0 ? `WAITON ${waitFor.filter(Boolean).join(",")}\n\n` : ""}${after.filter(Boolean).length > 0 ? `AFTER ${after.filter(Boolean).join(",")}\n\n` : ""}==CHANGEUSER ${changeUser}\n\nSUBMIT ${jobName}`;
        }

        const overrides: Record<string, string> = {
            "SET VOLUME": volume,
            "SET IN": scriptIn,
            "SET OUT": output,
            "SET EXECUTOR-PROGRAM": executor,
            "SET EVERY": every,
            "SET HOLD": hold ? "ON" : "OFF",
            "SET STOP-ON-ABEND": stopOnAbend ? "ON" : "OFF",
            "==CHANGEUSER": changeUser,
            "WAITON": waitFor.filter(Boolean).join(","),
            "AFTER": after.filter(Boolean).join(","),
            "SUBMIT": jobName,
        };

        return buildObey(loadedModel, overrides);

    }, [

        loadedModel,

        jobName,

        volume,

        scriptIn,

        output,

        executor,

        every,

        hold,

        stopOnAbend,

        changeUser,

        waitFor,

        after

    ]);

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

        <div className="min-h-screen bg-zinc-950 text-white">

            <Header />

            <div className="w-full space-y-8 p-4 md:p-6 lg:p-8">

                {matchingJobs.length > 1 && (
                    <div className="rounded-3xl border border-amber-500/35 bg-amber-500/5 p-6 backdrop-blur-xl space-y-4">
                        <div className="flex items-center gap-3">
                            <span className="h-2.5 w-2.5 rounded-full bg-amber-500 animate-ping" />
                            <h3 className="font-bold text-lg text-amber-200">
                                Plusieurs modèles correspondent à votre recherche. Veuillez choisir :
                            </h3>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                            {matchingJobs.map((job) => (
                                <button
                                    key={`${job.system}.${job.monitor}.${job.job_name}`}
                                    onClick={() => loadSpecificJob(job)}
                                    className="flex flex-col text-left p-4 rounded-2xl border border-zinc-800 bg-zinc-900/50 hover:border-violet-500 hover:bg-zinc-900/90 transition-all cursor-pointer"
                                >
                                    <span className="text-xs text-violet-400 font-bold uppercase">{job.system} • {job.monitor}</span>
                                    <span className="font-bold text-white text-lg mt-1">{job.job_name}</span>
                                    <span className="text-xs text-zinc-400 mt-2 line-clamp-1">
                                        {job.parameters["SET IN"] || "Aucun script"}
                                    </span>
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                <ModelCard

                    onLoad={loadModel}

                />

                <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 lg:gap-8">

                    <ConfigurationCard

                        jobName={jobName}
                        setJobName={setJobName}

                        volume={volume}
                        setVolume={setVolume}

                        scriptIn={scriptIn}
                        setScriptIn={setScriptIn}

                        output={output}
                        setOutput={setOutput}

                        executor={executor}
                        setExecutor={setExecutor}

                        hold={hold}
                        setHold={setHold}

                        stopOnAbend={stopOnAbend}
                        setStopOnAbend={setStopOnAbend}

                        changeUser={changeUser}
                        setChangeUser={setChangeUser}

                    />

                    <EveryCard

                        every={every}

                        setEvery={setEvery}

                    />

                </div>

                <DependencyCard

                    waitFor={waitFor}
                    setWaitFor={setWaitFor}

                    after={after}
                    setAfter={setAfter}

                />

                <PreviewCard

                    obey={obey}

                />

            </div>

        </div>

    );

}