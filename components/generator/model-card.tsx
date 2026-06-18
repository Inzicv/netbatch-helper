"use client";

import { useState } from "react";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface ModelCardProps {

    onLoad: (query: string) => void;

}

export default function ModelCard({

    onLoad

}: ModelCardProps) {

    const [query, setQuery] = useState("");

    return (

        <Card className="rounded-2xl border-zinc-800 bg-zinc-900 p-6">

            <h2 className="mb-6 text-xl font-bold">

                📚 Modèle

            </h2>

            <div className="space-y-4">

                <Input

                    placeholder="Nom ou numéro du job"

                    value={query}

                    onChange={(e) => setQuery(e.target.value)}

                    className="border-zinc-800 bg-zinc-950"

                />

                <Button

                    className="w-full"

                    onClick={() => onLoad(query)}

                >

                    Charger le modèle

                </Button>

            </div>

        </Card>

    );

}