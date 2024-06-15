const { default: axios } = require("axios");
const { zeroTierApiUrl, zeroTierNetworkId } = require("~/config.json");
const generateBaseEmbed = require("@modules/embeds/generateBaseEmbed");
const sendGenericErrorReply = require('@modules/errors/messages/sendGenericErrorReply');
const { ApplicationCommandOptionType } = require("discord.js");
const sendReply = require("@modules/messaging/sendReply");

module.exports = {
    name: 'ip',
    description: 'Get the list of zero tier network members',
    options: [
        {
            name: 'keyword',
            description: 'Search by node id, name or ip',
            type: ApplicationCommandOptionType.String
        },
        {
            name: 'ephemeral',
            description: 'Should message be only visible to you',
            type: ApplicationCommandOptionType.Boolean
        }
    ],
    callback: async (client, interaction) => {
        const keyword = interaction.options.get('keyword')?.value ?? "";
        const ephemeral = interaction.options.get('ephemeral')?.value ?? true;

        const headers = {
            'Authorization': 'token ' + process.env.ZERO_TIER_API_KEY
        };

        await axios.get(`${zeroTierApiUrl}/network/${zeroTierNetworkId}/member`, { headers })
            .then(data => {
                const members = data.data.filter(x => x.nodeId?.includes(keyword)
                                                   || x.name?.includes(keyword)
                                                   || x.config?.ipAssignments.some(ipAs => ipAs.includes(keyword)));

                const embed = generateBaseEmbed(client, 'IP');
                generateEmbed(embed, members);

                sendReply(interaction, {
                    embeds: [embed],
                    ephemeral: ephemeral
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