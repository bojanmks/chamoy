import { ApplicationCommandOptionType } from "discord.js";
import sendTextReply from "@modules/messaging/sendTextReply";
import { CHECK_EMOJI, CLOWN_EMOJI } from "@modules/shared/constants/emojis";

export default {
    name: 'say',
    description: 'Make bot send a message',
    userResponses: [
        {
            userId: '478912904691974155',
            response: `desi ti jbt ${CLOWN_EMOJI}`
        }
    ],
    options: [
        {
            name: 'message',
            description: 'Message to send',
            type: ApplicationCommandOptionType.String,
            required: true
        }
    ],
    callback: (client: any, interaction: any) => {
        const messageToSend = interaction.options.get('message').value;
        interaction.channel.send(messageToSend);

        sendTextReply(interaction, `${CHECK_EMOJI} Message sent`, true);
    }
};