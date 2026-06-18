"use client";

import { useMemo, useState } from "react";

import Header from "@/components/header";

import ModelCard from "@/components/generator/model-card";
import ConfigurationCard from "@/components/generator/configuration-card";
import EveryCard from "@/components/generator/every-card";
import PreviewCard from "@/components/generator/preview-card";

import { loadJobModel } from "@/lib/generator";

export default function GeneratorPage() {

    const [jobName, setJobName] = useState("");

    const [volume, setVolume] = useState("");

    const [scriptIn, setScriptIn] = useState("");

    const [output, setOutput] = useState("");

    const [executor, setExecutor] = useState("");

    const [hold, setHold] = useState("");

    const [stopOnAbend, setStopOnAbend] = useState("");

    const [changeUser, setChangeUser] = useState("");

    const [every, setEvery] = useState("");

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

            job.parameters["SET HOLD"] || ""

        );

        setStopOnAbend(

            job.parameters["SET STOP-ON-ABEND"] || ""

        );

        setChangeUser(

            job.parameters["==CHANGEUSER"] || ""

        );

        setEvery(

            job.parameters["SET EVERY"] || ""

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

SET HOLD ${hold}

SET STOP-ON-ABEND ${stopOnAbend}

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

        changeUser

    ]);

    return (

        <div className="min-h-screen bg-zinc-950 text-white">

            <Header />

            <div className="mx-auto max-w-7xl space-y-6 p-6">

                <h1 className="text-4xl font-bold">

                    🧬 Obey Generator

                </h1>

                <div className="grid grid-cols-3 gap-6">

                    <ModelCard

                        onLoad={loadModel}

                    />

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

                <PreviewCard

                    obey={obey}

                />

            </div>

        </div>

    );

}