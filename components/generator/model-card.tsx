"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";

import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

import { searchJobs } from "@/lib/search";

interface ModelCardProps {

    onLoad: (query: string) => void;

}

export default function ModelCard({

    onLoad

}: ModelCardProps) {

    const [query, setQuery] = useState("");

    const results = useMemo(

        () => {

            if (!query) {

                return [];

            }

            return searchJobs(query).slice(0, 10);

        },

        [

            query

        ]

    );

    return (

        <Card className="rounded-3xl border border-zinc-800/70 bg-zinc-900/70 p-8 backdrop-blur-xl">

            <div className="mb-8 flex items-center gap-4">

                <div className="rounded-2xl bg-violet-500/10 p-3">

                    <Search className="h-6 w-6 text-violet-400" />

                </div>

                <h2 className="text-2xl font-bold text-white">

                    Modèle

                </h2>

            </div>

            <div className="rounded-2xl border border-zinc-800 bg-zinc-950/50 p-5">

                <Input

                    value={query}

                    placeholder="Rechercher un modèle..."

                    className="
                        h-14
                        border-zinc-800
                        bg-zinc-950
                        text-zinc-200
                        placeholder:text-zinc-500
                        focus-visible:ring-violet-500
                    "

                    onChange={(e) =>

                        setQuery(

                            e.target.value

                        )

                    }

                />

                {

                    results.length > 0 && (

                        <div className="mt-4 space-y-2">

                            {

                                results.map(

                                    (job) => (

                                        <button

                                            key={`${job.monitor}_${job.job_name}`}

                                            className="
                                                flex
                                                w-full
                                                items-center
                                                justify-between
                                                rounded-2xl
                                                border
                                                border-zinc-800
                                                bg-zinc-950
                                                px-5
                                                py-4
                                                text-left
                                                transition-all
                                                hover:border-violet-500
                                                hover:bg-zinc-900
                                            "

                                            onClick={() => {

                                                setQuery(

                                                    job.job_name

                                                );

                                                onLoad(

                                                    job.job_name

                                                );

                                            }}

                                        >

                                            <div>

                                                <div className="font-semibold text-white">

                                                    {job.job_name}

                                                </div>

                                                <div className="text-sm text-zinc-500">

                                                    {job.monitor}

                                                </div>

                                            </div>

                                            <div className="rounded-full bg-violet-500/10 px-3 py-1 text-sm text-violet-300">

                                                #

                                                {

                                                    job.job_number

                                                }

                                            </div>

                                        </button>

                                    )

                                )

                            }

                        </div>

                    )

                }

            </div>

        </Card>

    );

}