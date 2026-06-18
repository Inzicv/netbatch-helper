"use client";

import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface ConfigurationCardProps {

    jobName: string;
    setJobName: (value: string) => void;

    volume: string;
    setVolume: (value: string) => void;

    scriptIn: string;
    setScriptIn: (value: string) => void;

    output: string;
    setOutput: (value: string) => void;

    executor: string;
    setExecutor: (value: string) => void;

    hold: string;
    setHold: (value: string) => void;

    stopOnAbend: string;
    setStopOnAbend: (value: string) => void;

    changeUser: string;
    setChangeUser: (value: string) => void;

}

export default function ConfigurationCard({

    jobName,
    setJobName,

    volume,
    setVolume,

    scriptIn,
    setScriptIn,

    output,
    setOutput,

    executor,
    setExecutor,

    hold,
    setHold,

    stopOnAbend,
    setStopOnAbend,

    changeUser,
    setChangeUser

}: ConfigurationCardProps) {

    return (

        <Card className="rounded-2xl border-zinc-800 bg-zinc-900 p-6">

            <h2 className="mb-6 text-xl font-bold">

                ⚙ Configuration

            </h2>

            <div className="space-y-4">

                <div>

                    <Label>Job Name</Label>

                    <Input

                        value={jobName}

                        onChange={(e) => setJobName(e.target.value)}

                        className="mt-2 border-zinc-800 bg-zinc-950"

                    />

                </div>

                <div>

                    <Label>Volume</Label>

                    <Input

                        value={volume}

                        onChange={(e) => setVolume(e.target.value)}

                        className="mt-2 border-zinc-800 bg-zinc-950"

                    />

                </div>

                <div>

                    <Label>Script IN</Label>

                    <Input

                        value={scriptIn}

                        onChange={(e) => setScriptIn(e.target.value)}

                        className="mt-2 border-zinc-800 bg-zinc-950"

                    />

                </div>

                <div>

                    <Label>Output</Label>

                    <Input

                        value={output}

                        onChange={(e) => setOutput(e.target.value)}

                        className="mt-2 border-zinc-800 bg-zinc-950"

                    />

                </div>

                <div>

                    <Label>Executor</Label>

                    <Input

                        value={executor}

                        onChange={(e) => setExecutor(e.target.value)}

                        className="mt-2 border-zinc-800 bg-zinc-950"

                    />

                </div>

                <div>

                    <Label>Hold</Label>

                    <Input

                        value={hold}

                        onChange={(e) => setHold(e.target.value)}

                        className="mt-2 border-zinc-800 bg-zinc-950"

                    />

                </div>

                <div>

                    <Label>Stop on Abend</Label>

                    <Input

                        value={stopOnAbend}

                        onChange={(e) => setStopOnAbend(e.target.value)}

                        className="mt-2 border-zinc-800 bg-zinc-950"

                    />

                </div>

                <div>

                    <Label>ChangeUser</Label>

                    <Input

                        value={changeUser}

                        onChange={(e) => setChangeUser(e.target.value)}

                        className="mt-2 border-zinc-800 bg-zinc-950"

                    />

                </div>

            </div>

        </Card>

    );

}