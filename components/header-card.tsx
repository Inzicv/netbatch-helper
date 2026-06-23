import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

import {

    Hash,

    User,

    Server,
    
    FileCode

} from "lucide-react";

interface HeaderCardProps {

    jobName: string;

    monitor: string;

    system: string;

    jobNumber: number;

    user: string;

    description: string;

}

export default function HeaderCard({

    jobName,

    monitor,

    system,

    jobNumber,

    user,

    description

}: HeaderCardProps) {

    return (

        <Card className="rounded-3xl border border-zinc-800 bg-[#111113] p-8">

            <div className="space-y-6">

                <div className="flex items-center justify-between">

                    <h1 className="text-3xl font-bold tracking-tight text-white">

                        {jobName}

                    </h1>

                    <Button asChild className="rounded-2xl border border-violet-500/20 bg-violet-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-violet-700 transition-all shadow-lg shadow-violet-500/10">
                        <Link href={`/generator?system=${system}&monitor=${monitor}&model=${jobName}`} className="flex items-center gap-2">
                            <FileCode className="h-4 w-4" />
                            Utiliser comme modèle
                        </Link>
                    </Button>

                </div>

                <div className="flex flex-wrap gap-3">

                    <Badge className="gap-2 rounded-full border border-violet-500/20 bg-violet-500/10 px-4 py-2 text-violet-300">

                        <Server className="h-3 w-3" />

                        {system} • {monitor}

                    </Badge>

                    <Badge className="gap-2 rounded-full border border-zinc-700 bg-zinc-950 px-4 py-2 text-zinc-300">

                        <Hash className="h-3 w-3" />

                        {jobNumber}

                    </Badge>

                    <Badge className="gap-2 rounded-full border border-zinc-700 bg-zinc-950 px-4 py-2 text-zinc-300">

                        <User className="h-3 w-3" />

                        {user}

                    </Badge>

                </div>

                <div className="max-w-5xl text-zinc-400 leading-relaxed">

                    {description || "Aucune description"}

                </div>

            </div>

        </Card>

    );

}