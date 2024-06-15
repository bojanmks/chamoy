import schedule from 'node-schedule';
import getJobs from '@modules/jobs/getJobs';
import { CURRENT_ENVIRONMENT } from '@modules/shared/constants/environments';

export default async (client: any) => {
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

        console.log(`✅ ${job.name} job scheduled`);
    }
};