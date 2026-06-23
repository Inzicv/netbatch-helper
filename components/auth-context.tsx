"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";

interface AuthContextType {
    isAuthenticated: boolean;
    login: (username: string, pass: string) => Promise<boolean>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        // Check for session in localStorage on mount
        const session = localStorage.getItem("netbatch_auth");
        if (session === "true") {
            setIsAuthenticated(true);
        } else {
            setIsAuthenticated(false);
        }
        setIsLoading(false);
    }, []);

    useEffect(() => {
        if (!isLoading) {
            if (!isAuthenticated && pathname !== "/login") {
                router.replace("/login");
            } else if (isAuthenticated && pathname === "/login") {
                router.replace("/explorer");
            }
        }
    }, [isAuthenticated, pathname, isLoading, router]);

    const login = async (username: string, pass: string): Promise<boolean> => {
        // Basic credentials check (mocked for reassurance)
        if (
            (username.toLowerCase() === "admin" && pass === "netbatch2026") ||
            (username.toLowerCase() === "operator" && pass === "HPNonStop") ||
            (username.toLowerCase() === "netbatch" && pass === "helper")
        ) {
            localStorage.setItem("netbatch_auth", "true");
            setIsAuthenticated(true);
            return true;
        }
        return false;
    };

    const logout = () => {
        localStorage.removeItem("netbatch_auth");
        setIsAuthenticated(false);
        router.replace("/login");
    };

    if (isLoading || (!isAuthenticated && pathname !== "/login")) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-[#09090b]">
                <div className="flex flex-col items-center gap-4">
                    <div className="h-10 w-10 animate-spin rounded-full border-4 border-violet-500 border-t-transparent"></div>
                    <p className="text-sm font-medium text-zinc-400">Chargement de la session...</p>
                </div>
            </div>
        );
    }

    return (
        <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}
