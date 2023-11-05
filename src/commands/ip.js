const { default: axios } = require("axios");
const { zeroTierApiUrl, zeroTierNetworkId } = require("../../config.json");
const generateBaseEmbed = require("../modules/embeds/generateBaseEmbed");
const sendGenericErrorReply = require('../modules/errors/messages/sendGenericErrorReply');
const { ApplicationCommandOptionType } = require("discord.js");

module.exports = {
    name: 'ip',
    description: 'Get list of zero tier network members',
    options: [
        {
            name: 'nodeid',
            description: 'Part of the Node ID to search by',
            type: ApplicationCommandOptionType.String
        }
    ],
    callback: async (client, interaction) => {
        const nodeIdKeyword = interaction.options.get('nodeid')?.value ?? "";

        const headers = {
            'Authorization': 'token ' + process.env.ZERO_TIER_API_KEY
        };

        await axios.get(`${zeroTierApiUrl}/network/${zeroTierNetworkId}/member`, { headers })
            .then(data => {
                const members = data.data.filter(x => x.nodeId.includes(nodeIdKeyword));

                const embed = generateBaseEmbed(client, 'IP');
                generateEmbed(embed, members);

                interaction.reply({
                    embeds: [embed]
                });
            })
            .catch(error => {
                console.error('❌ Error fetching zero tier members:');
                console.error(error);
                sendGenericErrorReply(interaction);
            });
    }
};

function generateEmbed(embed, members) {
    embed.addFields(
        {
            name: 'Network ID',
            value: zeroTierNetworkId
        },
        {
            name: 'Node ID',
            value: members.map(x => x.nodeId).join('\n'),
            inline: true
        },
        {
            name: 'Name',
            value: members.map(x => x.name || "/").join('\n'),
            inline: true
        },
        {
            name: 'IP',
            value: members.map(x => x.config.ipAssignments.join(', ')).join('\n'),
            inline: true
        }
    );
}