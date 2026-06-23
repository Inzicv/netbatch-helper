"use client";

import { Card } from "@/components/ui/card";

interface JobCardProps {

    selected?: boolean;

    jobName: string;

    script: string;

    user: string;

    monitor: string;

    system: string;

    onClick?: () => void;

}

export default function JobCard({

    selected = false,

    jobName,

    script,

    user,

    monitor,

    system,

    onClick

}: JobCardProps) {

    return (

        <Card

            onClick={onClick}

            className={`
                cursor-pointer
                rounded-3xl
                border
                p-5
                transition-all
                duration-300

                ${
                    selected
                        ? "border-violet-500 bg-violet-500/10 shadow-[0_0_40px_rgba(124,58,237,0.25)]"
                        : "border-zinc-800 bg-[#111113] hover:border-violet-500/50 hover:bg-zinc-900"
                }
            `}
        >

            <div className="space-y-4">

                <div>

                    <div className="text-xl font-bold tracking-tight text-white">

                        {jobName}

                    </div>

                    <div className="mt-2 break-all text-sm text-zinc-500">

                        {script}

                    </div>

                </div>

                <div className="flex items-center justify-between">

                    <div className="rounded-full border border-zinc-700 bg-zinc-900 px-3 py-1 text-xs font-medium text-zinc-300">

                        User {user}

                    </div>

                    <div className="rounded-full border border-violet-500/20 bg-violet-500/10 px-3 py-1 text-xs font-medium text-violet-300">

                        {system} • {monitor}

                    </div>

                </div>

            </div>

        </Card>

    );

}