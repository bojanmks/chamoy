import { ApplicationCommandOptionType } from "discord.js";
import { ICommandParameterChoice } from "./ICommandParameterChoice";
import { ICommandParameterChoicesRepositoryOptions } from "./ICommandParameterChoicesRepositoryOptions";

export interface ICommandParameter {
    name: string;
    description: string;
    type: ApplicationCommandOptionType;
    choices?: ICommandParameterChoice[];
    choicesRepositoryOptions?: ICommandParameterChoicesRepositoryOptions<any>;
    required?: boolean;
    default?: any;
}