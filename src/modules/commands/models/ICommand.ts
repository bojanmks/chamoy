import { ApplicationCommandType, Client, CommandInteraction } from "discord.js";
import { ICommandParameter } from "./ICommandParameter";
import { ICommandUserResponse } from "./ICommandUserResponse";

export interface ICommand {
    name: string;
    description?: string;
    options?: ICommandParameter[];
    deleted?: boolean;
    type: ApplicationCommandType;
    environments?: string[];
    onlyDevs?: boolean;
    userResponses?: ICommandUserResponse[];
    hasEphemeralResponse?: boolean;
    hasEphemeralParameter?: boolean;
    ephemeralParameterDefaultValue?: boolean;

    execute(client: Client, interaction: CommandInteraction): void;

    get computedOptions(): ICommandParameter[];

    getParameter<T>(interaction: CommandInteraction, parameterName: string): T | undefined
}