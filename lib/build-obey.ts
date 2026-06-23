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

    const processedKeys = new Set<string>(["RESET"]);

    // Process parameters present in the model
    for (const [key, value] of Object.entries(model.parameters)) {
        if (key === "RESET") {
            continue;
        }

        let finalValue = value;

        if (key in overrides) {

            finalValue = overrides[key];

        }

        processedKeys.add(key);

        if (finalValue === "") {

            // Skip empty dependencies or changeuser parameters
            if (key === "WAITON" || key === "AFTER" || key === "==CHANGEUSER") {
                continue;
            }

            lines.push(key);

        }

        else {

            lines.push(`${key} ${finalValue}`);

        }

        lines.push("");

    }

    // Process any new overrides that weren't in the model parameters
    for (const [key, value] of Object.entries(overrides)) {
        if (processedKeys.has(key) || key === "SUBMIT") {
            continue;
        }

        if (value !== "") {
            lines.push(`${key} ${value}`);
            lines.push("");
        }
    }

    const submitName = overrides["SUBMIT"] || model.job_name;

    lines.push(`SUBMIT ${submitName}`);

    return lines.join("\n");

}