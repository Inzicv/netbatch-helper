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

        <Card className="rounded-2xl border-zinc-800 bg-zinc-900 p-6">

            <h2 className="mb-6 text-xl font-bold">

                📅 Planification

            </h2>

            <div className="space-y-5">

                <div>

                    <div className="text-sm text-zinc-500">

                        EVERY

                    </div>

                    <div>

                        {every}

                    </div>

                </div>

                <div>

                    <div className="text-sm text-zinc-500">

                        Traduction humaine

                    </div>

                    <div className="whitespace-pre-line">

                        {translation}

                    </div>

                </div>

                <div>

                    <div className="text-sm text-zinc-500">

                        Prochaine exécution

                    </div>

                    <div>

                        {nextRun}

                    </div>

                </div>

            </div>

        </Card>

    );

}