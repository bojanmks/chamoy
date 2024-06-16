import { ApplicationCommandOptionType, Client, CommandInteraction } from "discord.js";
import sendTextReply from "@modules/messaging/sendTextReply";
import { CHECK_EMOJI, CLOWN_EMOJI } from "@modules/shared/constants/emojis";
import { BaseCommand } from "@modules/commands/models/BaseCommand";
import { CommandUserResponse } from "@modules/commands/models/CommandUserResponse";
import { CommandParameter } from "@modules/commands/models/CommandParameter";

class SayCommand extends BaseCommand {
    name: string = 'say';
    description: string | null = 'Make bot send a message';

    override options: CommandParameter[] | null = [
        {
            name: 'message',
            description: 'Message to send',
            type: ApplicationCommandOptionType.String,
            required: true,
            default: undefined,
            choices: null
        }
    ];

    override userResponses: CommandUserResponse[] | null = [
        {
            userId: '478912904691974155',
            response: `desi ti jbt ${CLOWN_EMOJI}`
        }
    ];
    
    execute(client: Client, interaction: CommandInteraction): void {
        const messageToSend = this.getParameter<string>(interaction, 'message')!;
        interaction.channel?.send(messageToSend);

        sendTextReply(interaction, `${CHECK_EMOJI} Message sent`, true);
    }
}

const command = new SayCommand();

export default command;