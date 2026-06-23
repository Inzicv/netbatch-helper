"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import {

    Database,

    Dna,

    WandSparkles,

    Settings,

    ClipboardCheck

} from "lucide-react";

export default function Header() {

    const pathname = usePathname();

    return (

        <header className="sticky top-0 z-50 border-b border-zinc-800/50 bg-[#09090b]/90 backdrop-blur-xl">

            <div className="mx-auto flex h-24 w-full items-center justify-between px-6 md:px-8">

                <div className="flex items-center gap-5">

                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-500/10">

                        <Dna className="h-7 w-7 text-violet-400" />

                    </div>

                    <div>

                        <div className="text-2xl font-bold tracking-tight text-white">

                            NETBATCH HELPER

                        </div>

                        <div className="mt-1 text-sm text-zinc-500">

                            HP NonStop • Batchcom • Explorer • Generator

                        </div>

                    </div>

                </div>

                <div className="flex gap-2 rounded-3xl border border-zinc-800 bg-[#111113] p-2">

                    <Link

                        href="/explorer"

                        className={`
                            flex items-center gap-3 rounded-2xl px-6 py-3 transition-all duration-300
                            ${
                                pathname === "/explorer"

                                    ? "bg-violet-600 text-white shadow-[0_0_25px_rgba(124,58,237,.4)]"

                                    : "text-zinc-400 hover:bg-zinc-900 hover:text-white"
                            }
                        `}

                    >

                        <Database className="h-5 w-5" />

                        <div className="flex flex-col leading-none">

                            <span className="text-xs">

                                Explorer

                            </span>

                            <span className="font-semibold">

                                Base

                            </span>

                        </div>

                    </Link>

                    <Link

                        href="/generator"

                        className={`
                            flex items-center gap-3 rounded-2xl px-6 py-3 transition-all duration-300
                            ${
                                pathname === "/generator"

                                    ? "bg-violet-600 text-white shadow-[0_0_25px_rgba(124,58,237,.4)]"

                                    : "text-zinc-400 hover:bg-zinc-900 hover:text-white"
                            }
                        `}

                    >

                        <WandSparkles className="h-5 w-5" />

                        <div className="flex flex-col leading-none">

                            <span className="text-xs">

                                Obey

                            </span>

                            <span className="font-semibold">

                                Generator

                            </span>

                        </div>

                    </Link>

                    <Link

                        href="/admin"

                        className={`
                            flex items-center gap-3 rounded-2xl px-6 py-3 transition-all duration-300
                            ${
                                pathname === "/admin"

                                    ? "bg-violet-600 text-white shadow-[0_0_25px_rgba(124,58,237,.4)]"

                                    : "text-zinc-400 hover:bg-zinc-900 hover:text-white"
                            }
                        `}

                    >

                        <Settings className="h-5 w-5" />

                        <div className="flex flex-col leading-none">

                            <span className="text-xs">

                                Administration

                            </span>

                            <span className="font-semibold">

                                Database

                            </span>

                        </div>

                    </Link>

                    <Link

                        href="/audit"

                        className={`
                            flex items-center gap-3 rounded-2xl px-6 py-3 transition-all duration-300
                            ${
                                pathname === "/audit"

                                    ? "bg-violet-600 text-white shadow-[0_0_25px_rgba(124,58,237,.4)]"

                                    : "text-zinc-400 hover:bg-zinc-900 hover:text-white"
                            }
                        `}

                    >

                        <ClipboardCheck className="h-5 w-5" />

                        <div className="flex flex-col leading-none">

                            <span className="text-xs">

                                Audit &

                            </span>

                            <span className="font-semibold">

                                Recherche

                            </span>

                        </div>

                    </Link>

                </div>

            </div>

        </header>

    );

}