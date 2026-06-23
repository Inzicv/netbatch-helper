"use client";

import React, { useState } from "react";
import { useAuth } from "@/components/auth-context";
import { Lock, User, Eye, EyeOff, Dna, ShieldAlert } from "lucide-react";

export default function LoginPage() {
    const { login } = useAuth();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            const success = await login(username, password);
            if (!success) {
                setError("Identifiants incorrects. Veuillez réessayer.");
            }
        } catch {
            setError("Une erreur s'est produite lors de la connexion.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#09090b] px-4 py-12 sm:px-6 lg:px-8">
            {/* Background elements */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-violet-900/20 via-zinc-950/50 to-zinc-950"></div>
            <div className="absolute -top-[40%] -left-[20%] h-[80%] w-[60%] rounded-full bg-violet-600/10 blur-[120px]"></div>
            <div className="absolute -bottom-[40%] -right-[20%] h-[80%] w-[60%] rounded-full bg-fuchsia-600/10 blur-[120px]"></div>

            <div className="z-10 w-full max-w-md space-y-8">
                {/* Header/Logo */}
                <div className="flex flex-col items-center text-center">
                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-violet-500/10 shadow-[0_0_50px_rgba(139,92,246,0.15)] ring-1 ring-violet-500/30">
                        <Dna className="h-10 w-10 text-violet-400" />
                    </div>
                    <h2 className="mt-6 text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
                        NETBATCH HELPER
                    </h2>
                    <p className="mt-2 text-sm text-zinc-400">
                        HP NonStop Explorer & Obey Generator
                    </p>
                </div>

                {/* Login Card */}
                <div className="rounded-3xl border border-zinc-800/80 bg-[#111113]/70 p-8 shadow-[0_20px_50px_rgba(0,0,0,0.5)] backdrop-blur-xl md:p-10">
                    <div className="mb-8 text-center sm:text-left">
                        <h3 className="text-xl font-bold text-white">Connexion</h3>
                        <p className="mt-1.5 text-xs text-zinc-500">
                            Veuillez entrer vos identifiants Netbatch pour accéder à l'application.
                        </p>
                    </div>

                    <form className="space-y-6" onSubmit={handleSubmit}>
                        {error && (
                            <div className="flex gap-3 rounded-2xl border border-rose-500/20 bg-rose-500/5 p-4 text-sm text-rose-400">
                                <ShieldAlert className="h-5 w-5 shrink-0" />
                                <span>{error}</span>
                            </div>
                        )}

                        <div className="space-y-2">
                            <label className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
                                Identifiant
                            </label>
                            <div className="relative">
                                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-zinc-500">
                                    <User className="h-5 w-5" />
                                </div>
                                <input
                                    id="username"
                                    type="text"
                                    required
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    placeholder="Ex: admin"
                                    className="block w-full rounded-2xl border border-zinc-800 bg-zinc-950/50 py-4.5 pr-4 pl-12 text-sm text-white placeholder-zinc-600 outline-none transition-all duration-300 focus:border-violet-500/60 focus:ring-1 focus:ring-violet-500/60"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <label className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
                                    Mot de passe
                                </label>
                            </div>
                            <div className="relative">
                                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-zinc-500">
                                    <Lock className="h-5 w-5" />
                                </div>
                                <input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className="block w-full rounded-2xl border border-zinc-800 bg-zinc-950/50 py-4.5 pr-12 pl-12 text-sm text-white placeholder-zinc-600 outline-none transition-all duration-300 focus:border-violet-500/60 focus:ring-1 focus:ring-violet-500/60"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute inset-y-0 right-0 flex items-center pr-4 text-zinc-500 hover:text-white"
                                >
                                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="group relative flex w-full justify-center rounded-2xl bg-violet-600 py-4.5 text-sm font-semibold text-white shadow-[0_0_30px_rgba(124,58,237,0.3)] transition-all duration-300 hover:bg-violet-500 hover:shadow-[0_0_35px_rgba(124,58,237,0.5)] focus:outline-none focus:ring-2 focus:ring-violet-500 disabled:opacity-50"
                        >
                            {loading ? (
                                <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                            ) : (
                                "Se connecter"
                            )}
                        </button>
                    </form>

                    <div className="mt-8 text-center text-xs text-zinc-600">
                        Système sécurisé à usage professionnel uniquement
                    </div>
                </div>
            </div>
        </div>
    );
}
