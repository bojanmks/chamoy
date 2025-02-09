import BaseCommand from "@modules/commands/models/BaseCommand";
import { sendTextReply } from "@modules/messaging/replying";
import { Client, CommandInteraction } from "discord.js";

class PingCommand extends BaseCommand {
    name: string = 'ping';
    description?: string = '🏓';

    override hasEphemeralResponse?: boolean | undefined = true;
    
    async execute(client: Client, interaction: CommandInteraction): Promise<void> {
        await sendTextReply(interaction, 'pong');
    }

}

const command = new PingCommand();

export default command;