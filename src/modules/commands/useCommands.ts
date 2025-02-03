import { ApplicationCommandType, Client, CommandInteraction, ApplicationCommandOptionType } from "discord.js";
import { ICommand } from "./models/ICommand";
import { ICommandParameter } from "./models/ICommandParameter";
import { ICommandUserResponse } from "./models/ICommandUserResponse";

abstract class BaseCommand implements ICommand {
    abstract name: string;

    description?: string | undefined;
    options?: ICommandParameter[] | undefined;
    deleted?: boolean | undefined;
    type: ApplicationCommandType = ApplicationCommandType.ChatInput;;
    environments?: string[] | undefined;
    onlyDevs?: boolean | undefined;
    userResponses?: ICommandUserResponse[] | undefined;

    hasEphemeralResponse?: boolean | undefined;
    hasEphemeralParameter?: boolean | undefined;
    ephemeralParameterDefaultValue?: boolean | undefined = false;

    abstract execute(client: Client, interaction: CommandInteraction): void;

    get computedOptions(): ICommandParameter[] {
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