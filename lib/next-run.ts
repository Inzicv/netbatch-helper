import { CronExpressionParser } from "cron-parser";

export function getNextRun(cron: string): string {
    if (!cron) {
        return "-";
    }

    try {
        const interval = CronExpressionParser.parse(cron);
        const nextDate = interval.next().toDate();

        return nextDate.toLocaleString("fr-FR", {
            dateStyle: "short",
            timeStyle: "short",
        });
    } catch {
        return "-";
    }
}
