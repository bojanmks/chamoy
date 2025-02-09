import BaseCommand from "@modules/commands/models/BaseCommand";
import { Emojis } from "@modules/emojis/enums/Emojis";
import { sendTextReply } from "@modules/messaging/replying";
import { useQueue } from "discord-player";
import { Client, CommandInteraction } from "discord.js";

class LeaveCommand extends BaseCommand {
    name: string = 'leave';
    description: string = 'Stop playing songs and leave the channel';

    override hasEphemeralResponse?: boolean | undefined = true;

    async execute(client: Client, interaction: CommandInteraction): Promise<void> {
        const queue = useQueue();

        if (!queue?.connection) {
            await sendTextReply(interaction, `${Emojis.Info} Bot is not playing music`);
            return;
        }

        queue?.connection?.destroy();

        await sendTextReply(interaction, Emojis.Wave);
    }
}

const command = new LeaveCommand;

export default command;