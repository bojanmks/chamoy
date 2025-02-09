import { Client, CommandInteraction } from "discord.js";

import BaseCommand from "@modules/commands/models/BaseCommand";
import { sendReply } from "@modules/messaging/replying";

class ChamoyCommand extends BaseCommand {
    name: string = 'chamoy';
    description: string = '🥶';
    
    async execute(client: Client, interaction: CommandInteraction): Promise<void> {
        await sendReply(interaction, {
            files: [{
                attachment: 'https://cdn.discordapp.com/attachments/961345922300788796/1012484705611939840/chamoy.webm',
                name: 'chamoy.webm'
            }]
        });
    }
}

const command = new ChamoyCommand();

export default command;