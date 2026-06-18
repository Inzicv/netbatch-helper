"use client";

import {

    Clipboard,

    Download,

    ScrollText

} from "lucide-react";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface PreviewCardProps {

    obey: string;

}

export default function PreviewCard({

    obey

}: PreviewCardProps) {

    async function copyObey() {

        await navigator.clipboard.writeText(

            obey

        );

    }

    function downloadObey() {

        const blob = new Blob(

            [obey],

            {

                type: "text/plain"

            }

        );

        const url = URL.createObjectURL(

            blob

        );

        const link = document.createElement(

            "a"

        );

        link.href = url;

        link.download = "job.obey";

        link.click();

        URL.revokeObjectURL(

            url

        );

    }

    return (

        <Card className="rounded-3xl border border-zinc-800/70 bg-zinc-900/70 p-8 backdrop-blur-xl">

            <div className="mb-8 flex items-center justify-between">

                <div className="flex items-center gap-4">

                    <div className="rounded-2xl bg-violet-500/10 p-3">

                        <ScrollText className="h-6 w-6 text-violet-400" />

                    </div>

                    <div>

                        <h2 className="text-2xl font-bold text-white">

                            OBEY généré

                        </h2>

                        <div className="text-zinc-500">

                            Prévisualisation avant téléchargement

                        </div>

                    </div>

                </div>

                <div className="flex gap-3">

                    <Button

                        onClick={copyObey}

                        className="rounded-2xl"

                    >

                        <Clipboard className="mr-2 h-4 w-4" />

                        Copier

                    </Button>

                    <Button

                        variant="secondary"

                        onClick={downloadObey}

                        className="rounded-2xl"

                    >

                        <Download className="mr-2 h-4 w-4" />

                        Télécharger

                    </Button>

                </div>

            </div>

            <pre className="max-h-[700px] overflow-auto rounded-3xl border border-zinc-800 bg-[#0b0d13] p-8 text-sm text-zinc-300">

                {obey}

            </pre>

        </Card>

    );

}