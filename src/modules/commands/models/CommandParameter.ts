import { ApplicationCommandOptionType } from "discord.js";
import { CommandParameterChoice } from "./CommandParameterChoice";

export interface CommandParameter {
    name: string,
    description: string,
    type: ApplicationCommandOptionType,
    choices: CommandParameterChoice[] | null,
    required: boolean,
    default: any
}