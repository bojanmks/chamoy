import { ApplicationCommandType, Client, CommandInteraction } from "discord.js";
import { CommandParameter } from "./CommandParameter";
import { CommandUserResponse } from "./CommandUserResponse";

export interface Command {
    name: string;
    description: string | null;
    options: CommandParameter[] | null;
    deleted: boolean;
    type: ApplicationCommandType;
    environments: string[] | null;
    onlyDevs: boolean;
    userResponses: CommandUserResponse[] | null;
    execute(client: Client, interaction: CommandInteraction): void;
}