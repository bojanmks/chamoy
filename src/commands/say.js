const { ApplicationCommandOptionType } = require("discord.js");
const sendTextReply = require("@modules/messaging/sendTextReply");
const { CHECK_EMOJI, CLOWN_EMOJI } = require("@modules/shared/constants/emojis");

module.exports = {
    name: 'say',
    description: 'Make bot send a message',
    userResponses: [
        {
            userId: '292050833640652801',
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
    callback: (client, interaction) => {
        const messageToSend = interaction.options.get('message').value;
        interaction.channel.send(messageToSend);

        sendTextReply(interaction, `${CHECK_EMOJI} Message sent`, true);
    }
};