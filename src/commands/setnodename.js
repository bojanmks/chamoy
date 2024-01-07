const { ApplicationCommandOptionType } = require("discord.js");
const sendTextReply = require("@modules/messaging/sendTextReply");
const { default: axios } = require("axios");
const { zeroTierApiUrl, zeroTierNetworkId } = require("@/config.json");
const sendGenericErrorReply = require('@modules/errors/messages/sendGenericErrorReply');
const { CHECK_EMOJI } = require("@modules/shared/constants/emojis");

module.exports = {
    name: 'setnodename',
    description: 'Sets a name for a zero tier user',
    options: [
        {
            name: 'nodeid',
            description: 'User node ID',
            type: ApplicationCommandOptionType.String,
            required: true
        },
        {
            name: 'name',
            description: 'New name',
            type: ApplicationCommandOptionType.String,
            required: true
        }
    ],
    callback: async (client, interaction) => {
        const nodeId = interaction.options.get('nodeid').value;
        const newName = interaction.options.get('name').value;

        const headers = {
            'Authorization': 'token ' + process.env.ZERO_TIER_API_KEY
        };

        await axios.post(`${zeroTierApiUrl}/network/${zeroTierNetworkId}/member/${nodeId}`, { name: newName }, { headers })
            .then(_ => {
                sendTextReply(interaction, `${CHECK_EMOJI} Updated the node **${nodeId}** name to **${newName}**`, true);
            })
            .catch(error => {
                console.error('❌ Error updating a zero tier node name:');
                console.error(error);
                sendGenericErrorReply(interaction);
            });
    }
};