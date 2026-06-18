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

        <Card className="rounded-2xl border-zinc-800 bg-zinc-900 p-6">

            <h2 className="mb-6 text-xl font-bold">

                🔗 Dépendances

            </h2>

            <div className="grid grid-cols-2 gap-6">

                <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-5">

                    <div className="mb-4 text-sm text-zinc-500">

                        Attend

                    </div>

                    <div className="space-y-2">

                        {waitFor.length === 0 ? (

                            <div className="text-zinc-400">

                                Aucun

                            </div>

                        ) : (

                            waitFor.map((job) => (

                                <div key={job}>

                                    {job}

                                </div>

                            ))

                        )}

                    </div>

                </div>

                <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-5">

                    <div className="mb-4 text-sm text-zinc-500">

                        Bloque

                    </div>

                    <div className="space-y-2">

                        {blockedByThis.length === 0 ? (

                            <div className="text-zinc-400">

                                Aucun

                            </div>

                        ) : (

                            blockedByThis.map((job) => (

                                <div key={job}>

                                    {job}

                                </div>

                            ))

                        )}

                    </div>

                </div>

            </div>

        </Card>

    );

}