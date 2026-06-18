"use client";

import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface EveryCardProps {

    every: string;

    setEvery: (value: string) => void;

}

export default function EveryCard({

    every,

    setEvery

}: EveryCardProps) {

    return (

        <Card className="rounded-2xl border-zinc-800 bg-zinc-900 p-6">

            <h2 className="mb-6 text-xl font-bold">

                📅 EVERY

            </h2>

            <div className="space-y-4">

                <div>

                    <Label>Cron EVERY</Label>

                    <Input

                        value={every}

                        onChange={(e) => setEvery(e.target.value)}

                        placeholder="1,31 * * * 1-5"

                        className="mt-2 border-zinc-800 bg-zinc-950"

                    />

                </div>

                <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-4">

                    <div className="text-sm text-zinc-500">

                        Traduction

                    </div>

                    <div className="mt-2">

                        À compléter

                    </div>

                </div>

            </div>

        </Card>

    );

}