import { Card } from "@/components/ui/card";

interface ConfigCardProps {

    volume: string;

    scriptIn: string;

    output: string;

    executor: string;

    stopOnAbend: string;

}

export default function ConfigCard({

    volume,

    scriptIn,

    output,

    executor,

    stopOnAbend

}: ConfigCardProps) {

    return (

        <Card className="rounded-2xl border-zinc-800 bg-zinc-900 p-6">

            <h2 className="mb-6 text-xl font-bold">

                ⚙ Configuration

            </h2>

            <div className="space-y-5">

                <div>
                    <div className="text-sm text-zinc-500">
                        Volume
                    </div>

                    <div className="break-all">
                        {volume}
                    </div>
                </div>

                <div>
                    <div className="text-sm text-zinc-500">
                        Script IN
                    </div>

                    <div className="break-all">
                        {scriptIn}
                    </div>
                </div>

                <div>
                    <div className="text-sm text-zinc-500">
                        Output
                    </div>

                    <div className="break-all">
                        {output}
                    </div>
                </div>

                <div>
                    <div className="text-sm text-zinc-500">
                        Executor
                    </div>

                    <div className="break-all">
                        {executor}
                    </div>
                </div>

                <div>
                    <div className="text-sm text-zinc-500">
                        Stop on Abend
                    </div>

                    <div>
                        {stopOnAbend}
                    </div>
                </div>

            </div>

        </Card>

    );

}