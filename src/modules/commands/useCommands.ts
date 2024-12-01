import { ApplicationCommandType, Client, CommandInteraction, ApplicationCommandOptionType } from "discord.js";

export interface Command {
    name: string;
    description?: string;
    options?: CommandParameter[];
    deleted?: boolean;
    type: ApplicationCommandType;
    environments?: string[];
    onlyDevs?: boolean;
    userResponses?: CommandUserResponse[];
    execute(client: Client, interaction: CommandInteraction): void;
}

export interface CommandParameter {
    name: string,
    description: string,
    type: ApplicationCommandOptionType,
    choices?: CommandParameterChoice[],
    required?: boolean,
    default?: any
}

export interface CommandUserResponse {
    userId: string;
    response: string;
}

export interface CommandParameterChoice {
    name: string,
    value: any
}

abstract class BaseCommand implements Command {
    abstract name: string;

    description?: string | undefined;
    options?: CommandParameter[] | undefined;
    deleted?: boolean | undefined;
    type: ApplicationCommandType = ApplicationCommandType.ChatInput;;
    environments?: string[] | undefined;
    onlyDevs?: boolean | undefined;
    userResponses?: CommandUserResponse[] | undefined;

    abstract execute(client: Client, interaction: CommandInteraction): void;

    protected getParameter<T>(interaction: CommandInteraction, parameterName: string): T | null {
        const optionObject = interaction.options.get(parameterName);

        if (optionObject) {
            return optionObject.value as T;
        }

        const defaultValue = this.options?.find(o => o.name === parameterName)?.default;

        if (defaultValue !== undefined) {
            return defaultValue as T;
        }

        return null;
    }
}

export default () => {
    return {
        BaseCommand
    }
}