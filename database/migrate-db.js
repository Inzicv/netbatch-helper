const fs = require("fs");
const path = require("path");

const jobsPath = path.join(__dirname, "jobs.json");
const nameIndexPath = path.join(__dirname, "name_index.json");
const numberIndexPath = path.join(__dirname, "number_index.json");

function migrate() {
    console.log("Starting database migration...");

    if (!fs.existsSync(jobsPath)) {
        console.error("jobs.json not found!");
        return;
    }

    const fileContent = fs.readFileSync(jobsPath, "utf-8");
    const oldJobs = JSON.parse(fileContent);
    const newJobs = {};

    const nameIndex = {};
    const numberIndex = {};

    for (const [oldKey, job] of Object.entries(oldJobs)) {
        // Inject system attribute
        job.system = "ATLAS";

        // New compound key: system.monitor.job_name
        const newKey = `${job.system}.${job.monitor}.${job.job_name}`;
        newJobs[newKey] = job;

        // Rebuild name index
        const name = job.job_name.toUpperCase();
        if (!nameIndex[name]) {
            nameIndex[name] = [];
        }
        if (!nameIndex[name].includes(newKey)) {
            nameIndex[name].push(newKey);
        }

        // Rebuild number index using system.monitor.number
        if (job.job_number !== null && job.job_number !== undefined) {
            const numKey = `${job.system}.${job.monitor}.${job.job_number}`;
            numberIndex[numKey] = newKey;
        }
    }

    // Write updated files
    fs.writeFileSync(jobsPath, JSON.stringify(newJobs, null, 4), "utf-8");
    fs.writeFileSync(nameIndexPath, JSON.stringify(nameIndex, null, 4), "utf-8");
    fs.writeFileSync(numberIndexPath, JSON.stringify(numberIndex, null, 4), "utf-8");

    console.log(`Migration successful! Migrated ${Object.keys(newJobs).length} jobs.`);
}

migrate();
