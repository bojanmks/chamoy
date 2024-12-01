import useCommands from "@modules/commands/useCommands";
import useReplying from "@modules/messaging/useReplying";
import { Client, CommandInteraction } from "discord.js";

const { sendReply } = useReplying();
const { BaseCommand } = useCommands();

class ChamoyCommand extends BaseCommand {
    name: string = 'chamoy';
    description: string = '🥶';
    
    execute(client: Client, interaction: CommandInteraction): void {
        sendReply(interaction, {
            files: [{
                attachment: 'https://cdn.discordapp.com/attachments/961345922300788796/1012484705611939840/chamoy.webm',
                name: 'chamoy.webm'
            }]
        });
    }
}

const command = new ChamoyCommand();

export default command;