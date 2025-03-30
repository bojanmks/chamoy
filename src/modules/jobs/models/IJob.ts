import { Client } from "discord.js";

export interface IJob {
    name: string;
    cronExpression: string;
    deleted?: boolean;
    callback: (client: Client) => void | Promise<void>
}