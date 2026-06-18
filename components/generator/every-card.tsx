"use client";

import { useEffect, useState } from "react";
import { CalendarDays } from "lucide-react";

import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

import { translateEvery } from "@/lib/every";

interface EveryCardProps {

    every: string;

    setEvery: (value: string) => void;

}

const DAYS = [

    { label: "L", value: 1 },
    { label: "M", value: 2 },
    { label: "M", value: 3 },
    { label: "J", value: 4 },
    { label: "V", value: 5 },
    { label: "S", value: 6 },
    { label: "D", value: 0 }

];

export default function EveryCard({

    every,

    setEvery

}: EveryCardProps) {

    const [expertMode, setExpertMode] = useState(false);

    const [hours, setHours] = useState([

        "08",

        "12",

        "16",

        "18"

    ]);

    const [minutes, setMinutes] = useState([

        "00",

        "31"

    ]);

    const [days, setDays] = useState<number[]>([

        1,

        2,

        3,

        4,

        5

    ]);

    useEffect(() => {

        if (expertMode) {

            return;

        }

        const generatedEvery = `${minutes.join(",")} ${hours.join(",")} * * ${days.sort().join(",")}`;

        setEvery(

            generatedEvery

        );

    },

        [

            hours,

            minutes,

            days,

            expertMode,

            setEvery

        ]

    );

    function toggleDay(day: number) {

        if (

            days.includes(day)

        ) {

            setDays(

                days.filter(

                    d => d !== day

                )

            );

        }

        else {

            setDays(

                [

                    ...days,

                    day

                ]

            );

        }

    }

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

            <div className="space-y-6">

                <div className="flex gap-3">

                    <button

                        onClick={() => setExpertMode(false)}

                        className={`rounded-2xl px-4 py-2 transition-all ${!expertMode ? "bg-violet-600" : "bg-zinc-950"}`}

                    >

                        Simplifié

                    </button>

                    <button

                        onClick={() => setExpertMode(true)}

                        className={`rounded-2xl px-4 py-2 transition-all ${expertMode ? "bg-violet-600" : "bg-zinc-950"}`}

                    >

                        Expert

                    </button>

                </div>

                {

                    !expertMode && (

                        <>

                            <div>

                                <div className="mb-3 text-zinc-400">

                                    Heure(s)

                                </div>

                                <div className="flex flex-wrap gap-3">

                                    {

                                        hours.map(

                                            (hour, index) => (

                                                <Input

                                                    key={index}

                                                    value={hour}

                                                    onChange={(e) => {

                                                        const copy = [...hours];

                                                        copy[index] = e.target.value;

                                                        setHours(copy);

                                                    }}

                                                    className="w-20 border-zinc-800 bg-zinc-950"

                                                />

                                            )

                                        )

                                    }

                                </div>

                            </div>

                            <div>

                                <div className="mb-3 text-zinc-400">

                                    Minute(s)

                                </div>

                                <div className="flex flex-wrap gap-3">

                                    {

                                        minutes.map(

                                            (minute, index) => (

                                                <Input

                                                    key={index}

                                                    value={minute}

                                                    onChange={(e) => {

                                                        const copy = [...minutes];

                                                        copy[index] = e.target.value;

                                                        setMinutes(copy);

                                                    }}

                                                    className="w-20 border-zinc-800 bg-zinc-950"

                                                />

                                            )

                                        )

                                    }

                                </div>

                            </div>

                            <div>

                                <div className="mb-3 text-zinc-400">

                                    Jours

                                </div>

                                <div className="flex gap-2">

                                    {

                                        DAYS.map(

                                            day => (

                                                <button

                                                    key={day.value}

                                                    onClick={() =>

                                                        toggleDay(

                                                            day.value

                                                        )

                                                    }

                                                    className={`h-10 w-10 rounded-2xl transition-all ${days.includes(day.value)

                                                        ? "bg-violet-600"

                                                        : "bg-zinc-950"
                                                        }`}

                                                >

                                                    {

                                                        day.label

                                                    }

                                                </button>

                                            )

                                        )

                                    }

                                </div>

                            </div>

                        </>

                    )

                }

                {

                    expertMode && (

                        <Input

                            value={every}

                            onChange={(e) =>

                                setEvery(

                                    e.target.value

                                )

                            }

                            className="h-14 border-zinc-800 bg-zinc-950"

                        />

                    )

                }

                <div className="rounded-2xl border border-zinc-800 bg-zinc-950/50 p-5">

                    <div className="mb-3 text-xs uppercase tracking-widest text-zinc-500">

                        EVERY

                    </div>

                    <div className="font-mono text-zinc-300">

                        {

                            every

                        }

                    </div>

                </div>

                <div className="rounded-2xl border border-zinc-800 bg-zinc-950/50 p-5">

                    <div className="mb-3 text-xs uppercase tracking-widest text-zinc-500">

                        Traduction humaine

                    </div>

                    <div className="whitespace-pre-line text-zinc-300">

                        {

                            translateEvery(

                                every

                            )

                        }

                    </div>

                </div>

            </div>

        </Card>

    );

}