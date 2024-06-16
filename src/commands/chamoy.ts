import { BaseCommand } from "@models/commands/BaseCommand";
import sendReply from "@modules/messaging/sendReply";

class ChamoyCommand extends BaseCommand {
    name: string = 'chamoy';
    description: string = '🥶';
    
    callback(client: any, interaction: any): void {
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