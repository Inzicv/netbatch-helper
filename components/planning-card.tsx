import { CalendarDays } from "lucide-react";

import { Card } from "@/components/ui/card";

interface PlanningCardProps {

    every: string;

    translation: string;

    nextRun: string;

}

export default function PlanningCard({

    every,

    translation,

    nextRun

}: PlanningCardProps) {

    return (

        <Card className="rounded-3xl border border-zinc-800/70 bg-zinc-900/70 p-8 backdrop-blur-xl">

            <div className="mb-8 flex items-center gap-4">

                <div className="rounded-2xl bg-violet-500/10 p-3">

                    <CalendarDays className="h-6 w-6 text-violet-400" />

                </div>

                <h2 className="text-2xl font-bold text-white">

                    Planification

                </h2>

            </div>

            <div className="space-y-5">

                <div className="rounded-2xl border border-zinc-800/70 bg-zinc-950/50 p-5">

                    <div className="mb-3 text-xs uppercase tracking-widest text-zinc-500">

                        EVERY

                    </div>

                    <div className="font-mono text-sm text-zinc-200">

                        {every || "-"}

                    </div>

                </div>

                <div className="rounded-2xl border border-zinc-800/70 bg-zinc-950/50 p-5">

                    <div className="mb-3 text-xs uppercase tracking-widest text-zinc-500">

                        Traduction humaine

                    </div>

                    <div className="whitespace-pre-line text-zinc-300">

                        {translation || "-"}

                    </div>

                </div>

                <div className="rounded-2xl border border-zinc-800/70 bg-zinc-950/50 p-5">

                    <div className="mb-3 text-xs uppercase tracking-widest text-zinc-500">

                        Prochaine exécution

                    </div>

                    <div className="text-zinc-400">

                        {nextRun || "-"}

                    </div>

                </div>

            </div>

        </Card>

    );

}