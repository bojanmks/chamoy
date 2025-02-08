import { Client } from 'discord.js';
import schedule from 'node-schedule';
import useEnvironments from '@modules/environments/useEnvironments';
import useJobs from '@modules/jobs/useJobs';

const { getJobs } = useJobs();
const { CURRENT_ENVIRONMENT } = useEnvironments();

export default async (client: Client) => {
    const jobs = await getJobs();

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

        console.log(`⌚ ${job.name} job scheduled`);
    }
};