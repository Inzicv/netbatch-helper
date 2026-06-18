"use client";

import Link from "next/link";
import { Search, WandSparkles, Upload, Bot } from "lucide-react";

export default function Header() {

    return (

        <header className="border-b bg-background">

            <div className="mx-auto flex h-16 items-center px-6">

                <div className="text-xl font-bold">

                    NETBATCH HELPER

                </div>

                <div className="ml-10 flex gap-8">

                    <Link
                        href="/explorer"
                        className="flex items-center gap-2 text-sm font-medium hover:text-primary"
                    >
                        <Search className="h-4 w-4" />
                        Explorer
                    </Link>

                    <Link
                        href="/generator"
                        className="flex items-center gap-2 text-sm font-medium hover:text-primary"
                    >
                        <WandSparkles className="h-4 w-4" />
                        Obey Generator
                    </Link>

                    <Link
                        href="/import"
                        className="flex items-center gap-2 text-sm font-medium hover:text-primary"
                    >
                        <Upload className="h-4 w-4" />
                        Import Logs
                    </Link>

                    <Link
                        href="/assistant"
                        className="flex items-center gap-2 text-sm font-medium hover:text-primary"
                    >
                        <Bot className="h-4 w-4" />
                        Assistant
                    </Link>

                </div>

            </div>

        </header>

    );

}