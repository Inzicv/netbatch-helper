"use client";

import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

export default function SearchBar() {

    return (

        <div className="space-y-4">

            <div className="relative">

                <Search
                    className="absolute left-3 top-3 h-4 w-4 text-zinc-500"
                />

                <Input
                    placeholder="Rechercher un job, un script, un user..."
                    className="pl-10 bg-zinc-950 border-zinc-800"
                />

            </div>

        </div>

    );

}