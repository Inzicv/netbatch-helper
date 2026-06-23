import { sqliteTable, text, integer, index } from "drizzle-orm/sqlite-core";

export const jobs = sqliteTable("jobs", {
    // Unique ID: system.monitor.job_name (all uppercase)
    id: text("id").primaryKey(),
    system: text("system").notNull(),
    monitor: text("monitor").notNull(),
    jobName: text("job_name").notNull(),
    jobNumber: integer("job_number"),
    obeyForm: text("obey_form").notNull(),
    parameters: text("parameters", { mode: "json" }).notNull(),
}, (table) => ({
    jobNameIdx: index("job_name_idx").on(table.jobName),
    jobNumberIdx: index("job_number_idx").on(table.jobNumber),
    systemIdx: index("system_idx").on(table.system),
    monitorIdx: index("monitor_idx").on(table.monitor),
}));
