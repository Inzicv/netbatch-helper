"use client";

import { Card } from "@/components/ui/card";

interface JobCardProps {

    selected?: boolean;

    jobName: string;

    script: string;

    user: string;

    monitor: string;

}

export default function JobCard({

    selected = false,

    jobName,

    script,

    user,

    monitor

}: JobCardProps) {

    return (

        <Card
            className={`
                cursor-pointer
                rounded-2xl
                bg-zinc-900
                border-zinc-800
                p-4
                transition-all
                hover:border-violet-500
                hover:bg-zinc-800
                ${selected ? "border-violet-500" : ""}
            `}
        >

            <div className="space-y-3">

                <div className="text-lg font-bold">

                    {jobName}

                </div>

                <div className="text-sm text-zinc-400 break-all">

                    {script}

                </div>

                <div className="flex justify-between text-sm text-zinc-500">

                    <div>

                        User {user}

                    </div>

                    <div>

                        {monitor}

                    </div>

                </div>

            </div>

        </Card>

    );

}