"use client";

import { useMemo, useState } from "react";

import Header from "@/components/header";

import ModelCard from "@/components/generator/model-card";
import ConfigurationCard from "@/components/generator/configuration-card";
import EveryCard from "@/components/generator/every-card";
import DependencyCard from "@/components/dependency-card";
import PreviewCard from "@/components/generator/preview-card";

import { loadJobModel } from "@/lib/generator";

export default function GeneratorPage() {

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

    function loadModel(query: string) {

        const job = loadJobModel(query);

        if (!job) {

            return;

        }

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

    }

    const obey = useMemo(() => {

        return `ASSUME JOB

RESET

SET VOLUME ${volume}

SET IN ${scriptIn}

SET OUT ${output}

SET EXECUTOR-PROGRAM ${executor}

SET EVERY ${every}

SET HOLD ${hold ? "ON" : "OFF"}

SET STOP-ON-ABEND ${stopOnAbend ? "ON" : "OFF"}

${waitFor.length > 0 ? `WAITON ${waitFor.join(",")}` : ""}

${after.length > 0 ? `AFTER ${after.join(",")}` : ""}

==CHANGEUSER ${changeUser}

SUBMIT ${jobName}`;

    }, [

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

    return (

        <div className="min-h-screen bg-zinc-950 text-white">

            <Header />

            <div className="mx-auto max-w-7xl space-y-8 p-6">

                <ModelCard

                    onLoad={loadModel}

                />

                <div className="grid grid-cols-2 gap-8">

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