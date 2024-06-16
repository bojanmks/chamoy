import { ApplicationCommandOptionType } from "discord.js";
import sendTextReply from "@modules/messaging/sendTextReply";
import { CHECK_EMOJI, CLOWN_EMOJI } from "@modules/shared/constants/emojis";
import { BaseCommand } from "@models/commands/BaseCommand";

class SayCommand extends BaseCommand {
    name: string = 'say';
    description: string | null = 'Make bot send a message';

    override options: any[] | null = [
        {
            name: 'message',
            description: 'Message to send',
            type: ApplicationCommandOptionType.String,
            required: true
        }
    ];

    override userResponses: any[] | null = [
        {
            userId: '478912904691974155',
            response: `desi ti jbt ${CLOWN_EMOJI}`
        }
    ];
    
    callback(client: any, interaction: any): void {
        const messageToSend = interaction.options.get('message').value;
        interaction.channel.send(messageToSend);

        sendTextReply(interaction, `${CHECK_EMOJI} Message sent`, true);
    }
}

const command = new SayCommand();

export default command;