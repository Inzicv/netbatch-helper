"use client";

import { Search } from "lucide-react";

import { Input } from "@/components/ui/input";

interface SearchBarProps {

    value: string;

    onChange: (value: string) => void;

}

export default function SearchBar({

    value,

    onChange

}: SearchBarProps) {

    return (

        <div className="relative">

            <Search

                className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-zinc-500"

            />

            <Input

                value={value}

                onChange={(e) => onChange(e.target.value)}

                placeholder="Rechercher un job, un script, un user..."

                className="
                    h-14
                    rounded-2xl
                    border-zinc-800
                    bg-zinc-950/70
                    pl-12
                    text-zinc-200
                    placeholder:text-zinc-500
                    focus-visible:ring-violet-500
                "

            />

        </div>

    );

}