import useCommands from "@modules/commands/useCommands";
import useEmojis from "@modules/emojis/useEmojis";
import useReplying from "@modules/messaging/useReplying";
import { useQueue } from "discord-player";
import { Client, CommandInteraction } from "discord.js";

const { BaseCommand } = useCommands();
const { sendTextReply } = useReplying();
const { WAVE_EMOJI, INFO_EMOJI } = useEmojis();

class LeaveCommand extends BaseCommand {
    name: string = 'leave';
    description: string = 'Stop playing songs and leave the channel';

    override hasEphemeralResponse?: boolean | undefined = true;

    async execute(client: Client, interaction: CommandInteraction): Promise<void> {
        const queue = useQueue();

        if (!queue?.connection) {
            await sendTextReply(interaction, `${INFO_EMOJI} Bot is not playing music`);
            return;
        }

        queue?.connection?.destroy();

        await sendTextReply(interaction, WAVE_EMOJI);
    }
}

const command = new LeaveCommand;

export default command;