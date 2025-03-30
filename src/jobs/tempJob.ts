import { Client } from "discord.js";
import { IJob } from "../modules/jobs/models/IJob";

const TempJob: IJob = {
    name: 'Temp job',
    cronExpression: '0 * * * *',
    deleted: true,
    callback: async (client: Client) => {
        //
    }
};

export default TempJob;