import { default as axios } from "axios";
import { zeroTierApiUrl, zeroTierNetworkId } from "../../config.json";
import generateBaseEmbed from "@modules/embeds/generateBaseEmbed";
import sendGenericErrorReply from '@modules/errors/messages/sendGenericErrorReply';
import { ApplicationCommandOptionType } from "discord.js";
import sendReply from "@modules/messaging/sendReply";
import { BaseCommand } from "@models/commands/BaseCommand";

class IpCommand extends BaseCommand {
    name: string = 'ip';
    description: string = 'Get the list of zero tier network members';

    override options: any[] | null = [
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
    ];
    
    async callback(client: any, interaction: any): Promise<void> {
        const keyword = interaction.options.get('keyword')?.value ?? "";
        const ephemeral = interaction.options.get('ephemeral')?.value ?? true;

        const headers = {
            'Authorization': 'token ' + process.env.ZERO_TIER_API_KEY
        };

        await axios.get(`${zeroTierApiUrl}/network/${zeroTierNetworkId}/member`, { headers })
            .then((data: any) => {
                const members = data.data.filter((x: any) => x.nodeId?.includes(keyword)
                                                   || x.name?.includes(keyword)
                                                   || x.config?.ipAssignments.some((ipAs: any) => ipAs.includes(keyword)));

                const embed = generateBaseEmbed(client, 'IP');
                generateEmbed(embed, members);

                sendReply(interaction, {
                    embeds: [embed],
                    ephemeral: ephemeral
                });
            })
            .catch((error: any) => {
                console.error('❌ Error fetching zero tier members:');
                console.error(error);
                sendGenericErrorReply(interaction);
            });
    }

}

function generateEmbed(embed: any, members: any) {
    embed.addFields(
        {
            name: 'Network ID',
            value: zeroTierNetworkId
        },
        {
            name: 'Node ID',
            value: members.map((x: any) => x.nodeId).join('\n'),
            inline: true
        },
        {
            name: 'Name',
            value: members.map((x: any) => x.name || "/").join('\n'),
            inline: true
        },
        {
            name: 'IP',
            value: members.map((x: any) => x.config.ipAssignments.join(', ')).join('\n'),
            inline: true
        }
    );
}

const command = new IpCommand();

export default command;