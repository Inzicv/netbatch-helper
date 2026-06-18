import { Job } from "@/lib/types";

export function buildObey(
    model: Job,
    overrides: Record<string, string>
): string {

    const lines: string[] = [];

    lines.push("ASSUME JOB");
    lines.push("");
    lines.push("RESET");
    lines.push("");

    for (const [key, value] of Object.entries(model.parameters)) {

        let finalValue = value;

        if (key in overrides) {

            finalValue = overrides[key];

        }

        if (finalValue === "") {

            lines.push(key);

        }

        else {

            lines.push(`${key} ${finalValue}`);

        }

        lines.push("");

    }

    const submitName = overrides["SUBMIT"] || model.job_name;

    lines.push(`SUBMIT ${submitName}`);

    return lines.join("\n");

}