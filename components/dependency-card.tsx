import { GitBranch } from "lucide-react";

import { Card } from "@/components/ui/card";

interface DependencyCardProps {

    waitFor: string[];

    blockedByThis: string[];

}

export default function DependencyCard({

    waitFor,

    blockedByThis

}: DependencyCardProps) {

    return (

        <Card className="rounded-3xl border border-zinc-800/70 bg-zinc-900/70 p-8 backdrop-blur-xl">

            <div className="mb-8 flex items-center gap-4">

                <div className="rounded-2xl bg-violet-500/10 p-3">

                    <GitBranch className="h-6 w-6 text-violet-400" />

                </div>

                <h2 className="text-2xl font-bold text-white">

                    Dépendances

                </h2>

            </div>

            <div className="grid grid-cols-2 gap-6">

                <div className="rounded-2xl border border-zinc-800/70 bg-zinc-950/50 p-6">

                    <div className="mb-4 text-xs uppercase tracking-widest text-zinc-500">

                        Attend

                    </div>

                    <div className="space-y-3">

                        {

                            waitFor.length === 0

                                ? (

                                    <div className="text-zinc-500">

                                        Aucun

                                    </div>

                                )

                                : waitFor.map(

                                    job => (

                                        <div

                                            key={job}

                                            className="rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-3 text-zinc-200"

                                        >

                                            {job}

                                        </div>

                                    )

                                )

                        }

                    </div>

                </div>

                <div className="rounded-2xl border border-zinc-800/70 bg-zinc-950/50 p-6">

                    <div className="mb-4 text-xs uppercase tracking-widest text-zinc-500">

                        Déclenche

                    </div>

                    <div className="space-y-3">

                        {

                            blockedByThis.length === 0

                                ? (

                                    <div className="text-zinc-500">

                                        Aucun

                                    </div>

                                )

                                : blockedByThis.map(

                                    job => (

                                        <div

                                            key={job}

                                            className="rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-3 text-zinc-200"

                                        >

                                            {job}

                                        </div>

                                    )

                                )

                        }

                    </div>

                </div>

            </div>

        </Card>

    );

}