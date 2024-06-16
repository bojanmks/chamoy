import { ApplicationCommandType } from "discord.js";

export interface Command {
    name: string;
    description: string | null;
    options: any[] | null;
    deleted: boolean;
    type: ApplicationCommandType;
    environments: string[] | null;
    onlyDevs: boolean;
    userResponses: any[] | null;
    callback(client: any, interaction: any): void;
}