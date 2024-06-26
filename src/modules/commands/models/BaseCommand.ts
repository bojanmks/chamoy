import { ApplicationCommandType, Client, CommandInteraction } from "discord.js";
import { Command } from "./Command";
import { CommandParameter } from "./CommandParameter";
import { CommandUserResponse } from "./CommandUserResponse";

export abstract class BaseCommand implements Command {
    abstract name: string;
    abstract description: string | null;

    options: CommandParameter[] | null = null;
    deleted: boolean = false;
    type: ApplicationCommandType = ApplicationCommandType.ChatInput;
    environments: string[] | null = null;
    onlyDevs: boolean = false;
    userResponses: CommandUserResponse[] | null = null;

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