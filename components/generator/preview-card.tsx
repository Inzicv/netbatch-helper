"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface PreviewCardProps {

    obey: string;

}

export default function PreviewCard({

    obey

}: PreviewCardProps) {

    async function copyObey() {

        await navigator.clipboard.writeText(obey);

    }

    return (

        <Card className="rounded-2xl border-zinc-800 bg-zinc-900 p-6">

            <h2 className="mb-6 text-xl font-bold">

                📜 Prévisualisation

            </h2>

            <pre className="max-h-[600px] overflow-auto rounded-xl border border-zinc-800 bg-zinc-950 p-5 text-sm text-zinc-300">

                {obey}

            </pre>

            <div className="mt-6 flex gap-3">

                <Button

                    onClick={copyObey}

                >

                    📋 Copier

                </Button>

                <Button

                    variant="secondary"

                >

                    📥 Télécharger

                </Button>

            </div>

        </Card>

    );

}