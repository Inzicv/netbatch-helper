"use client";

interface MonitorFiltersProps {

    selectedMonitors: string[];

    toggleMonitor: (monitor: string) => void;

}

export default function MonitorFilters({

    selectedMonitors,

    toggleMonitor

}: MonitorFiltersProps) {

    const monitors = [

        "$ZBAP",

        "$ZBAT",

        "$ZBAD"

    ];

    return (

        <div className="flex gap-3">

            {

                monitors.map(

                    (monitor) => (

                        <button

                            key={monitor}

                            onClick={() =>

                                toggleMonitor(

                                    monitor

                                )

                            }

                            className={`
                                rounded-2xl
                                px-2
                                py-1
                                text-sm
                                font-semibold
                                transition-all
                                duration-300
                                ${
                                    selectedMonitors.includes(

                                        monitor

                                    )

                                        ? "bg-violet-600 text-white shadow-[0_0_10px_rgba(124,58,237,.4)]"

                                        : "bg-zinc-900 text-zinc-400 hover:bg-zinc-800 hover:text-white"
                                }
                            `}

                        >

                            {monitor}

                        </button>

                    )

                )

            }

        </div>

    );

}