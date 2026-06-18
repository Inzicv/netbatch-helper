import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

interface HeaderCardProps {

    jobName: string;

    monitor: string;

    jobNumber: number;

    user: string;

    description: string;

}

export default function HeaderCard({

    jobName,

    monitor,

    jobNumber,

    user,

    description

}: HeaderCardProps) {

    return (

        <Card className="rounded-2xl border-zinc-800 bg-zinc-900 p-8">

            <div className="space-y-5">

                <div>

                    <h1 className="text-4xl font-bold">

                        {jobName}

                    </h1>

                </div>

                <div className="flex gap-3">

                    <Badge variant="secondary">

                        {monitor}

                    </Badge>

                    <Badge variant="secondary">

                        #{jobNumber}

                    </Badge>

                    <Badge variant="secondary">

                        {user}

                    </Badge>

                </div>

                <div className="text-zinc-400">

                    {description}

                </div>

            </div>

        </Card>

    );

}