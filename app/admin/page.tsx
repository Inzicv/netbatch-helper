"use client";

import { useMemo, useState, useEffect } from "react";
import { useDatabase } from "@/components/database-context";
import Header from "@/components/header";
import SearchBar from "@/components/search-bar";
import MonitorFilters from "@/components/monitor-filters";
import JobCard from "@/components/job-card";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { 
    Settings, 
    Trash2, 
    Plus, 
    Save, 
    FileText, 
    FolderPlus
} from "lucide-react";
import { Job } from "@/lib/types";

export default function AdminPage() {
    const { jobs, allJobs, loading, searchJobs, saveJob, deleteJob } = useDatabase();

    const [search, setSearch] = useState("");
    const [selectedMonitors, setSelectedMonitors] = useState(["$ZBAP", "$ZBAT", "$ZBAD"]);
    const [selectedJobKey, setSelectedJobKey] = useState<string | null>(null);

    // Editing State
    const [editJobName, setEditJobName] = useState("");
    const [editMonitor, setEditMonitor] = useState("");
    const [editJobNumber, setEditJobNumber] = useState<number | "">("");
    const [editObeyForm, setEditObeyForm] = useState("");

    // Add Job Dialog/Form State
    const [showAddForm, setShowAddForm] = useState(false);
    const [newJobName, setNewJobName] = useState("");
    const [newMonitor, setNewMonitor] = useState("$ZBAP");
    const [newJobNumber, setNewJobNumber] = useState<number | "">("");
    const [importMode, setImportMode] = useState<"clone" | "obey">("clone");
    const [cloneSourceKey, setCloneSourceKey] = useState("");
    const [importObeyText, setImportObeyText] = useState("");

    const filteredJobs = useMemo(() => {
        return searchJobs(search).filter(job => selectedMonitors.includes(job.monitor));
    }, [search, selectedMonitors, searchJobs]);

    // Set first job if none selected
    const activeJobKey = selectedJobKey || (filteredJobs[0] ? `${filteredJobs[0].monitor}_${filteredJobs[0].job_name}` : null);
    const activeJob = activeJobKey ? jobs[activeJobKey] : null;

    // Load active job into edit states
    useEffect(() => {
        setTimeout(() => {
            if (activeJob) {
                setEditJobName(activeJob.job_name);
                setEditMonitor(activeJob.monitor);
                setEditJobNumber(activeJob.job_number || "");
                setEditObeyForm(activeJob.obey_form || "");
            } else {
                setEditJobName("");
                setEditMonitor("");
                setEditJobNumber("");
                setEditObeyForm("");
            }
        }, 0);
    }, [activeJob]);

    function toggleMonitor(monitor: string) {
        if (selectedMonitors.includes(monitor)) {
            setSelectedMonitors(selectedMonitors.filter(m => m !== monitor));
        } else {
            setSelectedMonitors([...selectedMonitors, monitor]);
        }
    }

    // Save job handler
    async function handleSave() {
        if (!activeJobKey || !activeJob) return;

        if (!editJobName.trim()) {
            toast.error("Le nom du job est obligatoire");
            return;
        }

        if (!editMonitor.trim()) {
            toast.error("Le monitor est obligatoire");
            return;
        }

        if (editJobNumber === "") {
            toast.error("Le numéro de job est obligatoire");
            return;
        }

        try {
            // Parse parameters from raw OBEY form text
            const parsed = parseObeyText(editObeyForm);

            const updatedJob: Job = {
                job_name: editJobName.trim().toUpperCase(),
                job_number: Number(editJobNumber),
                monitor: editMonitor.trim().toUpperCase(),
                parameters: parsed.parameters,
                obey_form: editObeyForm,
            };

            const savedKey = await saveJob(activeJobKey, updatedJob);
            setSelectedJobKey(savedKey);
            toast.success("Job enregistré avec succès");
        } catch {
            toast.error("Erreur lors de la sauvegarde du job");
        }
    }

    // Delete job handler
    async function handleDelete() {
        if (!activeJobKey) return;

        if (confirm(`Êtes-vous sûr de vouloir supprimer le job ${activeJob?.job_name} ?`)) {
            try {
                await deleteJob(activeJobKey);
                setSelectedJobKey(null);
                toast.success("Job supprimé avec succès");
            } catch {
                toast.error("Erreur lors de la suppression du job");
            }
        }
    }

    // Parse Obey Text Helper
    function parseObeyText(obeyText: string) {
        const lines = obeyText.split("\n");
        const parameters: Record<string, string> = { "RESET": "" };
        let jobName = "";

        for (let line of lines) {
            line = line.trim();
            if (!line || line.startsWith("?") || line.startsWith("--")) continue;

            const upperLine = line.toUpperCase();
            if (upperLine.startsWith("ASSUME")) continue;
            if (upperLine === "RESET") {
                parameters["RESET"] = "";
                continue;
            }

            if (upperLine.startsWith("SET ")) {
                const parts = line.split(/\s+/);
                if (parts.length >= 2) {
                    const key = `SET ${parts[1].toUpperCase()}`;
                    const val = line.substring(line.indexOf(parts[1]) + parts[1].length).trim();
                    parameters[key] = val;
                }
                continue;
            }

            if (upperLine.startsWith("==")) {
                const parts = line.split(/\s+/);
                if (parts.length >= 1) {
                    const key = parts[0].toUpperCase();
                    const val = line.substring(line.indexOf(parts[0]) + parts[0].length).trim();
                    parameters[key] = val;
                }
                continue;
            }

            if (upperLine.startsWith("SUBMIT ")) {
                const parts = line.split(/\s+/);
                if (parts.length >= 2) {
                    jobName = parts[1].trim().toUpperCase();
                }
                continue;
            }

            const firstSpace = line.indexOf(" ");
            if (firstSpace !== -1) {
                const key = line.substring(0, firstSpace).trim().toUpperCase();
                const val = line.substring(firstSpace + 1).trim();
                parameters[key] = val;
            } else {
                parameters[line.toUpperCase()] = "";
            }
        }

        return { parameters, jobName };
    }

    // Add Job Form Handler
    async function handleAddJob(e: React.FormEvent) {
        e.preventDefault();

        const cleanName = newJobName.trim().toUpperCase();
        const cleanMonitor = newMonitor.trim().toUpperCase();

        if (!cleanName) {
            toast.error("Le nom du job est obligatoire");
            return;
        }

        if (!cleanMonitor) {
            toast.error("Le monitor est obligatoire");
            return;
        }

        if (newJobNumber === "") {
            toast.error("Le numéro de job est obligatoire");
            return;
        }

        try {
            let parameters: Record<string, string> = { "RESET": "" };
            let obeyForm = "";

            if (importMode === "clone") {
                if (!cloneSourceKey) {
                    toast.error("Veuillez sélectionner un job source à cloner");
                    return;
                }
                const sourceJob = jobs[cloneSourceKey];
                if (sourceJob) {
                    parameters = { ...sourceJob.parameters };
                    obeyForm = sourceJob.obey_form;
                }
            } else {
                if (!importObeyText.trim()) {
                    toast.error("Veuillez coller le script OBEY");
                    return;
                }
                const parsed = parseObeyText(importObeyText);
                parameters = parsed.parameters;
                obeyForm = importObeyText;
            }

            const newJob: Job = {
                job_name: cleanName,
                job_number: Number(newJobNumber),
                monitor: cleanMonitor,
                parameters,
                obey_form: obeyForm
            };

            const savedKey = await saveJob(null, newJob);
            setSelectedJobKey(savedKey);
            setShowAddForm(false);
            
            // Reset form fields
            setNewJobName("");
            setNewJobNumber("");
            setNewMonitor("$ZBAP");
            setImportObeyText("");
            setCloneSourceKey("");

            toast.success("Job ajouté avec succès");
        } catch {
            toast.error("Erreur lors de la création du job");
        }
    }

    return (
        <div className="h-screen overflow-hidden bg-[#09090b] text-white">
            <Header />

            <div className="mx-auto flex h-[calc(100vh-112px)] max-w-[1800px] gap-8 p-8">
                {/* SIDEBAR SEARCH & LIST */}
                <div className="flex w-[420px] flex-col gap-6">
                    <div className="rounded-3xl border border-zinc-800 bg-[#111113] p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-xl font-semibold text-white">Administration</h2>
                            <Button 
                                onClick={() => setShowAddForm(true)}
                                className="rounded-2xl bg-violet-600 hover:bg-violet-700 text-white flex items-center gap-1.5 px-4 py-2 text-sm font-semibold transition-all shadow-md shadow-violet-500/10"
                            >
                                <Plus className="h-4 w-4" />
                                Nouveau
                            </Button>
                        </div>

                        <SearchBar value={search} onChange={setSearch} />
                        <div className="mt-4">
                            <MonitorFilters selectedMonitors={selectedMonitors} toggleMonitor={toggleMonitor} />
                        </div>
                    </div>

                    <div className="flex-1 space-y-4 overflow-y-auto pr-2">
                        {loading ? (
                            <div className="text-center py-8 text-zinc-500">Chargement...</div>
                        ) : filteredJobs.length === 0 ? (
                            <div className="text-center py-8 text-zinc-500">Aucun job trouvé</div>
                        ) : (
                            filteredJobs.map((job) => {
                                const jobKey = `${job.monitor}_${job.job_name}`;
                                return (
                                    <JobCard
                                        key={jobKey}
                                        selected={activeJobKey === jobKey}
                                        jobName={job.job_name}
                                        script={job.parameters["SET IN"] || ""}
                                        user={job.parameters["==CHANGEUSER"] || ""}
                                        monitor={job.monitor}
                                        onClick={() => {
                                            setSelectedJobKey(jobKey);
                                            setShowAddForm(false);
                                        }}
                                    />
                                );
                            })
                        )}
                    </div>
                </div>

                {/* MAIN EDITOR PANE */}
                <div className="flex-1 overflow-y-auto pr-2">
                    {showAddForm ? (
                        /* ADD JOB FORM */
                        <Card className="rounded-3xl border border-zinc-800/70 bg-zinc-900/70 p-8 backdrop-blur-xl space-y-6">
                            <div className="flex items-center gap-4 mb-2">
                                <div className="rounded-2xl bg-violet-500/10 p-3">
                                    <FolderPlus className="h-6 w-6 text-violet-400" />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-bold text-white">Ajouter un nouveau job</h2>
                                    <p className="text-zinc-500 text-sm">Créez un job de toutes pièces, clonez-en un existant ou importez un script OBEY</p>
                                </div>
                            </div>

                            <form onSubmit={handleAddJob} className="space-y-6">
                                <div className="grid grid-cols-3 gap-6">
                                    <div className="space-y-2">
                                        <Label className="text-zinc-400">Nom du job *</Label>
                                        <Input
                                            value={newJobName}
                                            onChange={(e) => setNewJobName(e.target.value)}
                                            placeholder="OAPEXMPL"
                                            className="h-12 border-zinc-800 bg-zinc-950 text-zinc-200"
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-zinc-400">Monitor *</Label>
                                        <Input
                                            value={newMonitor}
                                            onChange={(e) => setNewMonitor(e.target.value)}
                                            placeholder="$ZBAP"
                                            className="h-12 border-zinc-800 bg-zinc-950 text-zinc-200"
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-zinc-400">Numéro du job (Obligatoire) *</Label>
                                        <Input
                                            type="number"
                                            value={newJobNumber}
                                            onChange={(e) => setNewJobNumber(e.target.value === "" ? "" : Number(e.target.value))}
                                            placeholder="999"
                                            className="h-12 border-zinc-800 bg-zinc-950 text-zinc-200"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <Label className="text-zinc-400 block mb-2">Mode d&apos;initialisation</Label>
                                    <div className="flex gap-4">
                                        <Button
                                            type="button"
                                            onClick={() => setImportMode("clone")}
                                            variant={importMode === "clone" ? "default" : "secondary"}
                                            className={`rounded-2xl px-6 py-2 transition-all ${importMode === "clone" ? "bg-violet-600 hover:bg-violet-700" : ""}`}
                                        >
                                            Cloner un job existant
                                        </Button>
                                        <Button
                                            type="button"
                                            onClick={() => setImportMode("obey")}
                                            variant={importMode === "obey" ? "default" : "secondary"}
                                            className={`rounded-2xl px-6 py-2 transition-all ${importMode === "obey" ? "bg-violet-600 hover:bg-violet-700" : ""}`}
                                        >
                                            Importer depuis un script OBEY
                                        </Button>
                                    </div>

                                    {importMode === "clone" ? (
                                        <div className="space-y-2">
                                            <Label className="text-zinc-400">Sélectionner le job source</Label>
                                            <select
                                                value={cloneSourceKey}
                                                onChange={(e) => setCloneSourceKey(e.target.value)}
                                                className="w-full h-12 rounded-2xl border border-zinc-800 bg-zinc-950 px-4 text-zinc-300 focus:outline-none focus:ring-2 focus:ring-violet-500"
                                            >
                                                <option value="">-- Choisir un job --</option>
                                                {allJobs.map((j) => (
                                                    <option key={`${j.monitor}_${j.job_name}`} value={`${j.monitor}_${j.job_name}`}>
                                                        {j.monitor} • {j.job_name} (#{j.job_number})
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    ) : (
                                        <div className="space-y-2">
                                            <Label className="text-zinc-400">Script OBEY à coller</Label>
                                            <Textarea
                                                value={importObeyText}
                                                onChange={(e) => setImportObeyText(e.target.value)}
                                                placeholder="ASSUME JOB&#10;RESET&#10;SET VOLUME \ATLAS...&#10;SET IN \ATLAS...&#10;SUBMIT OAPEXMPL"
                                                className="min-h-[250px] font-mono border-zinc-800 bg-zinc-950 text-zinc-200"
                                            />
                                        </div>
                                    )}
                                </div>

                                <div className="flex gap-4 pt-4 justify-end">
                                    <Button
                                        type="button"
                                        variant="secondary"
                                        onClick={() => setShowAddForm(false)}
                                        className="rounded-2xl px-6"
                                    >
                                        Annuler
                                    </Button>
                                    <Button
                                        type="submit"
                                        className="rounded-2xl bg-violet-600 hover:bg-violet-700 px-6 text-white"
                                    >
                                        Créer le job
                                    </Button>
                                </div>
                            </form>
                        </Card>
                    ) : activeJob ? (
                        /* EDIT JOB WORKSPACE */
                        <div className="space-y-8">
                            {/* Header / Info card */}
                            <Card className="rounded-3xl border border-zinc-800/70 bg-zinc-900/70 p-8 backdrop-blur-xl">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className="rounded-2xl bg-violet-500/10 p-3">
                                            <Settings className="h-6 w-6 text-violet-400" />
                                        </div>
                                        <div>
                                            <h1 className="text-3xl font-bold tracking-tight text-white">
                                                {activeJob.job_name}
                                            </h1>
                                            <p className="text-zinc-500 text-sm">Gestion et édition de la base de données</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-3">
                                        <Button
                                            onClick={handleDelete}
                                            variant="destructive"
                                            className="rounded-2xl flex items-center gap-2 px-5 py-2.5 font-semibold text-sm"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                            Supprimer
                                        </Button>
                                        <Button
                                            onClick={handleSave}
                                            className="rounded-2xl bg-violet-600 hover:bg-violet-700 text-white flex items-center gap-2 px-6 py-2.5 font-semibold text-sm shadow-lg shadow-violet-500/10"
                                        >
                                            <Save className="h-4 w-4" />
                                            Enregistrer
                                        </Button>
                                    </div>
                                </div>

                                <div className="grid grid-cols-3 gap-6 mt-8">
                                    <div className="space-y-2">
                                        <Label className="text-zinc-400">Nom du job</Label>
                                        <Input
                                            value={editJobName}
                                            onChange={(e) => setEditJobName(e.target.value)}
                                            className="h-12 border-zinc-800 bg-zinc-950/70 text-zinc-200"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-zinc-400">Monitor</Label>
                                        <Input
                                            value={editMonitor}
                                            onChange={(e) => setEditMonitor(e.target.value)}
                                            className="h-12 border-zinc-800 bg-zinc-950/70 text-zinc-200"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-zinc-400">Numéro du job</Label>
                                        <Input
                                            type="number"
                                            value={editJobNumber}
                                            onChange={(e) => setEditJobNumber(e.target.value === "" ? "" : Number(e.target.value))}
                                            className="h-12 border-zinc-800 bg-zinc-950/70 text-zinc-200"
                                        />
                                    </div>
                                </div>
                            </Card>

                            {/* OBEY Form Editor - Full Width */}
                            <Card className="rounded-3xl border border-zinc-800/70 bg-zinc-900/70 p-8 backdrop-blur-xl space-y-4">
                                <div className="flex items-center gap-2 mb-2">
                                    <FileText className="h-5 w-5 text-violet-400" />
                                    <h2 className="text-xl font-bold text-white">Édition de l&apos;OBEY brut</h2>
                                </div>

                                <Textarea
                                    value={editObeyForm}
                                    onChange={(e) => setEditObeyForm(e.target.value)}
                                    className="min-h-[500px] font-mono text-sm leading-relaxed border-zinc-800 bg-zinc-950/50 text-zinc-300 focus-visible:ring-violet-500"
                                />
                            </Card>
                        </div>
                    ) : (
                        <div className="h-full flex items-center justify-center text-zinc-500">
                            Veuillez sélectionner un job ou en créer un nouveau.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
