"use client";

import { Settings } from "lucide-react";

import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "../ui/switch";

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

    hold: boolean;
    setHold: (value: boolean) => void;

    stopOnAbend: boolean;
    setStopOnAbend: (value: boolean) => void;

    changeUser: string;
    setChangeUser: (value: string) => void;

}

function Field({

    label,

    value,

    onChange

}: {

    label: string;

    value: string;

    onChange: (value: string) => void;

}) {

    return (

        <div className="space-y-2">

            <Label className="text-zinc-400">

                {label}

            </Label>

            <Input

                value={value}

                onChange={(e) => onChange(e.target.value)}

                className="
                    h-12
                    rounded-2xl
                    border-zinc-800
                    bg-zinc-950/70
                    text-zinc-200
                    focus-visible:ring-violet-500
                "

            />

        </div>

    );

}

function Toggle({

    title,

    description,

    value,

    onChange

}: {

    title: string;

    description: string;

    value: boolean;

    onChange: (value: boolean) => void;

}) {

    return (

        <div className="flex items-center justify-between rounded-2xl border border-zinc-800 bg-zinc-950/50 p-5">

            <div>

                <div className="font-medium text-white">

                    {title}

                </div>

                <div className="mt-1 text-sm text-zinc-500">

                    {description}

                </div>

            </div>

            <Switch

                checked={value}

                onCheckedChange={onChange}

            />

        </div>

    );

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

        <Card className="rounded-3xl border border-zinc-800/70 bg-zinc-900/70 p-8 backdrop-blur-xl">

            <div className="mb-8 flex items-center gap-4">

                <div className="rounded-2xl bg-violet-500/10 p-3">

                    <Settings className="h-6 w-6 text-violet-400" />

                </div>

                <div>

                    <h2 className="text-2xl font-bold text-white">

                        Configuration

                    </h2>

                    <div className="text-zinc-500">

                        Définissez les paramètres du job

                    </div>

                </div>

            </div>

            <div className="space-y-6">

                <Field

                    label="Nom du job"

                    value={jobName}

                    onChange={setJobName}

                />

                <Field

                    label="Volume"

                    value={volume}

                    onChange={setVolume}

                />

                <Field

                    label="Script IN"

                    value={scriptIn}

                    onChange={setScriptIn}

                />

                <Field

                    label="Output"

                    value={output}

                    onChange={setOutput}

                />

                <Field

                    label="Executor"

                    value={executor}

                    onChange={setExecutor}

                />

                <Toggle

                    title="Hold après création"

                    description="Le job restera en attente jusqu'à son démarrage manuel"

                    value={hold}

                    onChange={setHold}

                />

                <Toggle

                    title="Protection Abend"

                    description="Arrêter automatiquement le job en cas d'erreur"

                    value={stopOnAbend}

                    onChange={setStopOnAbend}

                />

                <Field

                    label="Change User"

                    value={changeUser}

                    onChange={setChangeUser}

                />

            </div>

        </Card>

    );

}