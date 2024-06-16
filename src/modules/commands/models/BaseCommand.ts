import { ApplicationCommandType, Client, CommandInteraction } from "discord.js";
import { Command } from "./Command";

export abstract class BaseCommand implements Command {
    abstract name: string;
    abstract description: string | null;

    options: any[] | null = null;
    deleted: boolean = false;
    type: ApplicationCommandType = ApplicationCommandType.ChatInput;
    environments: string[] | null = null;
    onlyDevs: boolean = false;
    userResponses: any[] | null = null;

    abstract execute(client: Client, interaction: CommandInteraction): void;
}