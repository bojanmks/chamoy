const schedule = require('node-schedule');
const getJobs = require('../../modules/jobs/getJobs');
const { CURRENT_ENVIRONMENT } = require('../../modules/shared/constants/environments');

module.exports = (client) => {
    const jobs = getJobs();

    for (const job of jobs) {
        if (job.deleted) continue;
        if (job.environments && !job.environments.includes(CURRENT_ENVIRONMENT)) continue;

        schedule.scheduleJob(job.cronExpression, async () => {
            try {
                await job.callback(client);
            } catch (error) {
                console.error(`❌ Error running ${job.name} job:`);
                console.error(error);
            }
        });

        console.log(`✅ ${job.name} job scheduled`);
    }
};