import { Settings } from "lucide-react";

import { Card } from "@/components/ui/card";

interface ConfigCardProps {

    volume: string;

    scriptIn: string;

    output: string;

    executor: string;

    stopOnAbend: string;

}

function Item({

    label,

    value

}: {

    label: string;

    value: string;

}) {

    return (

        <div className="rounded-2xl border border-zinc-800/70 bg-zinc-950/50 p-4">

            <div className="mb-2 text-xs font-medium uppercase tracking-widest text-zinc-500">

                {label}

            </div>

            <div className="break-all text-sm text-zinc-200">

                {value || "-"}

            </div>

        </div>

    );

}

export default function ConfigCard({

    volume,

    scriptIn,

    output,

    executor,

    stopOnAbend

}: ConfigCardProps) {

    return (

        <Card className="rounded-3xl border border-zinc-800/70 bg-zinc-900/70 p-8 backdrop-blur-xl">

            <div className="mb-8 flex items-center gap-4">

                <div className="rounded-2xl bg-violet-500/10 p-3">

                    <Settings className="h-6 w-6 text-violet-400" />

                </div>

                <h2 className="text-2xl font-bold text-white">

                    Configuration

                </h2>

            </div>

            <div className="space-y-4">

                <Item

                    label="Volume"

                    value={volume}

                />

                <Item

                    label="Script IN"

                    value={scriptIn}

                />

                <Item

                    label="Output"

                    value={output}

                />

                <Item

                    label="Executor"

                    value={executor}

                />

                <Item

                    label="Stop on Abend"

                    value={stopOnAbend}

                />

            </div>

        </Card>

    );

}