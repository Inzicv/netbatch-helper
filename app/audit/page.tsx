"use client";

import { useMemo, useState } from "react";
import Header from "@/components/header";
import { useDatabase } from "@/components/database-context";
import { 
    Search, 
    Download, 
    SlidersHorizontal, 
    ChevronLeft, 
    ChevronRight, 
    Filter, 
    RefreshCw 
} from "lucide-react";

export default function AuditPage() {
    const { allJobs, loading } = useDatabase();

    // Filter states
    const [search, setSearch] = useState("");
    const [userFilter, setUserFilter] = useState("");
    const [selectedMonitors, setSelectedMonitors] = useState<string[]>([
        "$ZBAP",
        "$ZBAT",
        "$ZBAD"
    ]);
    const [hasWaiton, setHasWaiton] = useState<boolean | null>(null); // null = all, true = has it, false = doesn't
    const [hasAfter, setHasAfter] = useState<boolean | null>(null); // null = all, true = has it, false = doesn't

    // Pagination states
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(25);

    const toggleMonitor = (monitor: string) => {
        if (selectedMonitors.includes(monitor)) {
            setSelectedMonitors(selectedMonitors.filter(m => m !== monitor));
        } else {
            setSelectedMonitors([...selectedMonitors, monitor]);
        }
        setCurrentPage(1);
    };

    // Filtered Jobs Memo
    const filteredJobs = useMemo(() => {
        return allJobs.filter((job) => {
            // Monitor check
            if (!selectedMonitors.includes(job.monitor)) {
                return false;
            }

            // User filter check (case-insensitive substring)
            if (userFilter.trim()) {
                const jobUser = (job.parameters["==CHANGEUSER"] || "").toLowerCase();
                if (!jobUser.includes(userFilter.toLowerCase().trim())) {
                    return false;
                }
            }

            // WAITON check
            if (hasWaiton !== null) {
                const waitonVal = job.parameters["WAITON"] || "";
                const exists = waitonVal.trim().length > 0;
                if (hasWaiton !== exists) {
                    return false;
                }
            }

            // AFTER check
            if (hasAfter !== null) {
                const afterVal = job.parameters["AFTER"] || "";
                const exists = afterVal.trim().length > 0;
                if (hasAfter !== exists) {
                    return false;
                }
            }

            // General text search (name, description, script, executor, EVERY)
            if (search.trim()) {
                const q = search.toLowerCase().trim();
                const nameMatch = job.job_name.toLowerCase().includes(q);
                const descMatch = (job.parameters["SET DESCRIPTION"] || "").toLowerCase().includes(q);
                const scriptMatch = (job.parameters["SET IN"] || "").toLowerCase().includes(q);
                const execMatch = (job.parameters["SET EXECUTOR-PROGRAM"] || "").toLowerCase().includes(q);
                const everyMatch = (job.parameters["SET EVERY"] || "").toLowerCase().includes(q);

                if (!nameMatch && !descMatch && !scriptMatch && !execMatch && !everyMatch) {
                    return false;
                }
            }

            return true;
        });
    }, [allJobs, selectedMonitors, userFilter, hasWaiton, hasAfter, search]);

    // Paginated results memo
    const paginatedJobs = useMemo(() => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        return filteredJobs.slice(startIndex, startIndex + itemsPerPage);
    }, [filteredJobs, currentPage, itemsPerPage]);

    const totalPages = Math.ceil(filteredJobs.length / itemsPerPage) || 1;

    const handleExportCSV = () => {
        const headers = ["Numéro", "Nom", "Monitor", "User", "Description", "Script", "Executor", "EVERY", "WAITON", "AFTER"];
        const rows = filteredJobs.map(job => [
            job.job_number ?? "",
            job.job_name,
            job.monitor,
            job.parameters["==CHANGEUSER"] || "",
            job.parameters["SET DESCRIPTION"] || "",
            job.parameters["SET IN"] || "",
            job.parameters["SET EXECUTOR-PROGRAM"] || "",
            job.parameters["SET EVERY"] || "",
            job.parameters["WAITON"] || "",
            job.parameters["AFTER"] || ""
        ]);
        
        // Use UTF-8 BOM to support French accents in Excel
        const csvContent = [
            headers.join(","),
            ...rows.map(row => row.map(val => `"${String(val).replace(/"/g, '""')}"`).join(","))
        ].join("\n");
        
        const blob = new Blob([new Uint8Array([0xEF, 0xBB, 0xBF]), csvContent], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.setAttribute("href", url);
        link.setAttribute("download", `audit_jobs_${new Date().toISOString().split('T')[0]}.csv`);
        link.style.visibility = "hidden";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const resetFilters = () => {
        setSearch("");
        setUserFilter("");
        setSelectedMonitors(["$ZBAP", "$ZBAT", "$ZBAD"]);
        setHasWaiton(null);
        setHasAfter(null);
        setCurrentPage(1);
    };

    if (loading) {
        return (
            <div className="h-screen bg-[#09090b] text-white flex items-center justify-center">
                <div className="text-center space-y-4">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-violet-500 mx-auto"></div>
                    <div className="text-zinc-400">Chargement de la base de données...</div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-zinc-950 text-white">
            <Header />

            <div className="w-full space-y-6 p-4 md:p-6 lg:p-8">
                {/* PAGE HEADER */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-3xl font-extrabold tracking-tight text-white">
                            Audit & Recherche Globale
                        </h1>
                        <p className="mt-1 text-sm text-zinc-400">
                            Recherchez, filtrez et exportez l&apos;intégralité des jobs référencés dans la base.
                        </p>
                    </div>
                    <div className="flex gap-3">
                        <button
                            onClick={resetFilters}
                            className="flex items-center gap-2 rounded-xl border border-zinc-800 bg-[#111113] px-4 py-2.5 text-zinc-400 hover:bg-zinc-900 hover:text-white transition-all text-sm font-medium"
                        >
                            <RefreshCw className="h-4 w-4" />
                            Réinitialiser
                        </button>
                        <button
                            onClick={handleExportCSV}
                            disabled={filteredJobs.length === 0}
                            className="flex items-center gap-2 rounded-xl bg-violet-600 px-4 py-2.5 text-white hover:bg-violet-700 disabled:opacity-50 disabled:pointer-events-none transition-all shadow-[0_0_20px_rgba(124,58,237,.3)] text-sm font-medium"
                        >
                            <Download className="h-4 w-4" />
                            Exporter en CSV ({filteredJobs.length})
                        </button>
                    </div>
                </div>

                {/* FILTERS PANEL */}
                <div className="rounded-3xl border border-zinc-800 bg-[#111113]/85 p-6 backdrop-blur-md">
                    <div className="flex items-center gap-2 mb-4 border-b border-zinc-800 pb-3">
                        <SlidersHorizontal className="h-5 w-5 text-violet-400" />
                        <h2 className="font-semibold text-lg">Filtres de recherche</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {/* TEXT SEARCH */}
                        <div className="space-y-2">
                            <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                                Recherche textuelle
                            </label>
                            <div className="relative">
                                <Search className="absolute left-3 top-3 h-4 w-4 text-zinc-500" />
                                <input
                                    type="text"
                                    placeholder="Nom, Desc, Script, Exécuteur..."
                                    value={search}
                                    onChange={(e) => {
                                        setSearch(e.target.value);
                                        setCurrentPage(1);
                                    }}
                                    className="w-full rounded-xl border border-zinc-800 bg-zinc-950 py-2.5 pl-10 pr-4 text-sm text-white placeholder-zinc-500 focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500 transition-all"
                                />
                            </div>
                        </div>

                        {/* USER FILTER */}
                        <div className="space-y-2">
                            <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                                Utilisateur (CHANGEUSER)
                            </label>
                            <div className="relative">
                                <Filter className="absolute left-3 top-3 h-4 w-4 text-zinc-500" />
                                <input
                                    type="text"
                                    placeholder="Ex: 22,22..."
                                    value={userFilter}
                                    onChange={(e) => {
                                        setUserFilter(e.target.value);
                                        setCurrentPage(1);
                                    }}
                                    className="w-full rounded-xl border border-zinc-800 bg-zinc-950 py-2.5 pl-10 pr-4 text-sm text-white placeholder-zinc-500 focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500 transition-all"
                                />
                            </div>
                        </div>

                        {/* MONITORS */}
                        <div className="space-y-2">
                            <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider block">
                                Monitors Netbatch
                            </label>
                            <div className="flex gap-2 pt-1">
                                {["$ZBAP", "$ZBAT", "$ZBAD"].map((monitor) => {
                                    const selected = selectedMonitors.includes(monitor);
                                    return (
                                        <button
                                            key={monitor}
                                            onClick={() => toggleMonitor(monitor)}
                                            className={`flex-1 rounded-xl py-2 px-3 text-xs font-semibold transition-all border ${
                                                selected
                                                    ? "bg-violet-600/10 border-violet-500/50 text-violet-300"
                                                    : "bg-zinc-950 border-zinc-800 text-zinc-500 hover:text-zinc-300"
                                            }`}
                                        >
                                            {monitor}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* DEPENDENCY TOGGLES */}
                        <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-2">
                                <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider block">
                                    Dépendance WAITON
                                </label>
                                <select
                                    value={hasWaiton === null ? "all" : String(hasWaiton)}
                                    onChange={(e) => {
                                        const val = e.target.value;
                                        setHasWaiton(val === "all" ? null : val === "true");
                                        setCurrentPage(1);
                                    }}
                                    className="w-full rounded-xl border border-zinc-800 bg-zinc-950 py-2.5 px-3 text-sm text-white focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500 transition-all"
                                >
                                    <option value="all">Tous</option>
                                    <option value="true">Avec WAITON</option>
                                    <option value="false">Sans WAITON</option>
                                </select>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider block">
                                    Dépendance AFTER
                                </label>
                                <select
                                    value={hasAfter === null ? "all" : String(hasAfter)}
                                    onChange={(e) => {
                                        const val = e.target.value;
                                        setHasAfter(val === "all" ? null : val === "true");
                                        setCurrentPage(1);
                                    }}
                                    className="w-full rounded-xl border border-zinc-800 bg-zinc-950 py-2.5 px-3 text-sm text-white focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500 transition-all"
                                >
                                    <option value="all">Tous</option>
                                    <option value="true">Avec AFTER</option>
                                    <option value="false">Sans AFTER</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>

                {/* RESULTS GRID / TABLE */}
                <div className="rounded-3xl border border-zinc-800 bg-[#111113]/85 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[1000px] border-collapse text-left text-sm text-zinc-300">
                            <thead>
                                <tr className="border-b border-zinc-800 bg-[#151518] text-xs font-semibold uppercase tracking-wider text-zinc-400">
                                    <th className="py-4 px-6 w-20">Numéro</th>
                                    <th className="py-4 px-6 w-44">Nom Job</th>
                                    <th className="py-4 px-6 w-28">Monitor</th>
                                    <th className="py-4 px-6 w-24">User</th>
                                    <th className="py-4 px-6 max-w-xs">Description</th>
                                    <th className="py-4 px-6 max-w-sm">Script (SET IN)</th>
                                    <th className="py-4 px-6 max-w-xs">Exécuteur</th>
                                    <th className="py-4 px-6 w-36">EVERY (Planif)</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-zinc-850">
                                {paginatedJobs.length === 0 ? (
                                    <tr>
                                        <td colSpan={8} className="py-12 text-center text-zinc-500 font-medium">
                                            Aucun job ne correspond aux critères de recherche actuels.
                                        </td>
                                    </tr>
                                ) : (
                                    paginatedJobs.map((job) => {
                                        const changeUser = job.parameters["==CHANGEUSER"] || "";
                                        const description = job.parameters["SET DESCRIPTION"] || "";
                                        const setIn = job.parameters["SET IN"] || "";
                                        const executor = job.parameters["SET EXECUTOR-PROGRAM"] || "";
                                        const everyVal = job.parameters["SET EVERY"] || "";

                                        return (
                                            <tr 
                                                key={`${job.monitor}_${job.job_name}`}
                                                className="hover:bg-zinc-900/40 transition-colors group"
                                            >
                                                <td className="py-4 px-6 font-mono text-xs text-zinc-500">
                                                    {job.job_number ?? "-"}
                                                </td>
                                                <td className="py-4 px-6 font-semibold text-white group-hover:text-violet-400 transition-colors">
                                                    {job.job_name}
                                                </td>
                                                <td className="py-4 px-6">
                                                    <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${
                                                        job.monitor === "$ZBAP" 
                                                            ? "bg-emerald-500/10 text-emerald-400" 
                                                            : job.monitor === "$ZBAT" 
                                                                ? "bg-amber-500/10 text-amber-400" 
                                                                : "bg-blue-500/10 text-blue-400"
                                                    }`}>
                                                        {job.monitor}
                                                    </span>
                                                </td>
                                                <td className="py-4 px-6 font-mono text-xs text-zinc-400">
                                                    {changeUser || "-"}
                                                </td>
                                                <td className="py-4 px-6 truncate max-w-xs text-zinc-400" title={description}>
                                                    {description ? description.replace(/"/g, '') : "-"}
                                                </td>
                                                <td className="py-4 px-6 font-mono text-xs text-zinc-400 truncate max-w-sm" title={setIn}>
                                                    {setIn || "-"}
                                                </td>
                                                <td className="py-4 px-6 font-mono text-xs text-zinc-500 truncate max-w-xs" title={executor}>
                                                    {executor ? executor.split(".").pop() : "-"}
                                                </td>
                                                <td className="py-4 px-6 font-mono text-xs text-violet-400">
                                                    {everyVal || "-"}
                                                </td>
                                            </tr>
                                        );
                                    })
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* PAGINATION CONTROLS */}
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-t border-zinc-800 bg-[#151518] px-6 py-4 gap-4">
                        <div className="flex items-center gap-4">
                            <span className="text-sm text-zinc-400">
                                Affichage de <span className="font-semibold text-white">{filteredJobs.length === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1}</span> à{" "}
                                <span className="font-semibold text-white">
                                    {Math.min(currentPage * itemsPerPage, filteredJobs.length)}
                                </span>{" "}
                                sur <span className="font-semibold text-white">{filteredJobs.length}</span> jobs
                            </span>
                            <div className="flex items-center gap-2">
                                <span className="text-xs text-zinc-500">Par page :</span>
                                <select
                                    value={itemsPerPage}
                                    onChange={(e) => {
                                        setItemsPerPage(Number(e.target.value));
                                        setCurrentPage(1);
                                    }}
                                    className="rounded-lg border border-zinc-850 bg-zinc-950 py-1 px-2 text-xs text-zinc-300 focus:outline-none focus:border-violet-500"
                                >
                                    {[10, 25, 50, 100].map((size) => (
                                        <option key={size} value={size}>
                                            {size}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="flex items-center gap-1.5 self-end sm:self-auto">
                            <button
                                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                disabled={currentPage === 1}
                                className="rounded-xl border border-zinc-800 bg-zinc-950 p-2 text-zinc-400 hover:bg-zinc-900 hover:text-white disabled:opacity-30 disabled:pointer-events-none transition-all"
                            >
                                <ChevronLeft className="h-5 w-5" />
                            </button>

                            <div className="flex items-center gap-1 px-2">
                                <span className="text-sm text-zinc-400">
                                    Page <span className="font-semibold text-white">{currentPage}</span> sur <span className="font-semibold text-white">{totalPages}</span>
                                </span>
                            </div>

                            <button
                                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                disabled={currentPage === totalPages}
                                className="rounded-xl border border-zinc-800 bg-zinc-950 p-2 text-zinc-400 hover:bg-zinc-900 hover:text-white disabled:opacity-30 disabled:pointer-events-none transition-all"
                            >
                                <ChevronRight className="h-5 w-5" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
