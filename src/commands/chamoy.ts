import { BaseCommand } from "@modules/commands/models/BaseCommand";
import sendReply from "@modules/messaging/sendReply";
import { Client, CommandInteraction } from "discord.js";

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