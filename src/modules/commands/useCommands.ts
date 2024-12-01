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
    hasEphemeralResponse?: boolean;
    hasEphemeralParameter?: boolean;
    ephemeralParameterDefaultValue?: boolean;

    execute(client: Client, interaction: CommandInteraction): void;

    get computedOptions(): CommandParameter[];

    getParameter<T>(interaction: CommandInteraction, parameterName: string): T | undefined
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

    hasEphemeralResponse?: boolean | undefined;
    hasEphemeralParameter?: boolean | undefined;
    ephemeralParameterDefaultValue?: boolean | undefined = false;

    abstract execute(client: Client, interaction: CommandInteraction): void;

    get computedOptions(): CommandParameter[] {
        const commandOptions = [...(this.options ?? [])];

        if (this.hasEphemeralParameter) {
            commandOptions.push({
                name: 'ephemeral',
                description: 'Should message be only visible to you',
                type: ApplicationCommandOptionType.Boolean,
                default: this.ephemeralParameterDefaultValue ?? false
            })
        }

        return commandOptions;
    }

    getParameter<T>(interaction: CommandInteraction, parameterName: string): T | undefined {
        const optionObject = interaction.options.get(parameterName);

        if (optionObject) {
            return optionObject.value as T;
        }

        const defaultValue = this.computedOptions?.find(o => o.name === parameterName)?.default;

        if (defaultValue !== undefined) {
            return defaultValue as T;
        }

        return undefined;
    }
}

export default () => {
    return {
        BaseCommand
    }
}