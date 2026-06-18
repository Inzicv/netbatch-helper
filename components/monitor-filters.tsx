"use client";

import { Badge } from "@/components/ui/badge";

export default function MonitorFilters() {

    return (

        <div className="flex flex-wrap gap-3">

            <Badge className="bg-green-700 hover:bg-green-700">
                $ZBAP
            </Badge>

            <Badge className="bg-green-700 hover:bg-green-700">
                $ZBAT
            </Badge>

            <Badge className="bg-green-700 hover:bg-green-700">
                $ZBAD
            </Badge>

        </div>

    );

}