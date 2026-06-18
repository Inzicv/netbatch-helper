"use client";

import { GitBranch, Plus, Trash2 } from "lucide-react";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface DependencyCardProps {

    waitFor: string[];
    setWaitFor: (value: string[]) => void;

    after: string[];
    setAfter: (value: string[]) => void;

}

export default function DependencyCard({

    waitFor,
    setWaitFor,

    after,
    setAfter

}: DependencyCardProps) {

    function update(

        values: string[],

        setValues: (value: string[]) => void,

        index: number,

        value: string

    ) {

        const copy = [...values];

        copy[index] = value.toUpperCase();

        setValues(copy);

    }

    function remove(

        values: string[],

        setValues: (value: string[]) => void,

        index: number

    ) {

        setValues(

            values.filter(

                (_, i) => i !== index

            )

        );

    }

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

            <div className="grid grid-cols-2 gap-8">

                <div className="space-y-4">

                    <div className="text-zinc-400">

                        Attend

                    </div>

                    {

                        waitFor.map(

                            (job, index) => (

                                <div

                                    key={index}

                                    className="flex gap-3"

                                >

                                    <Input

                                        value={job}

                                        onChange={(e) =>

                                            update(

                                                waitFor,

                                                setWaitFor,

                                                index,

                                                e.target.value

                                            )

                                        }

                                        className="border-zinc-800 bg-zinc-950"

                                    />

                                    <Button

                                        variant="destructive"

                                        onClick={() =>

                                            remove(

                                                waitFor,

                                                setWaitFor,

                                                index

                                            )

                                        }

                                    >

                                        <Trash2 className="h-4 w-4" />

                                    </Button>

                                </div>

                            )

                        )

                    }

                    <Button

                        variant="secondary"

                        onClick={() =>

                            setWaitFor(

                                [

                                    ...waitFor,

                                    ""

                                ]

                            )

                        }

                    >

                        <Plus className="mr-2 h-4 w-4" />

                        Ajouter

                    </Button>

                </div>

                <div className="space-y-4">

                    <div className="text-zinc-400">

                        Déclenche

                    </div>

                    {

                        after.map(

                            (job, index) => (

                                <div

                                    key={index}

                                    className="flex gap-3"

                                >

                                    <Input

                                        value={job}

                                        onChange={(e) =>

                                            update(

                                                after,

                                                setAfter,

                                                index,

                                                e.target.value

                                            )

                                        }

                                        className="border-zinc-800 bg-zinc-950"

                                    />

                                    <Button

                                        variant="destructive"

                                        onClick={() =>

                                            remove(

                                                after,

                                                setAfter,

                                                index

                                            )

                                        }

                                    >

                                        <Trash2 className="h-4 w-4" />

                                    </Button>

                                </div>

                            )

                        )

                    }

                    <Button

                        variant="secondary"

                        onClick={() =>

                            setAfter(

                                [

                                    ...after,

                                    ""

                                ]

                            )

                        }

                    >

                        <Plus className="mr-2 h-4 w-4" />

                        Ajouter

                    </Button>

                </div>

            </div>

        </Card>

    );

}