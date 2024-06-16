import { default as axios } from "axios";
import { zeroTierApiUrl, zeroTierNetworkId } from "../../config.json";
import generateBaseEmbed from "@modules/embeds/generateBaseEmbed";
import sendGenericErrorReply from '@modules/errors/messages/sendGenericErrorReply';
import { ApplicationCommandOptionType, Client, CommandInteraction } from "discord.js";
import sendReply from "@modules/messaging/sendReply";
import { BaseCommand } from "@modules/commands/models/BaseCommand";
import { CommandParameter } from "@modules/commands/models/CommandParameter";

class IpCommand extends BaseCommand {
    name: string = 'ip';
    description: string = 'Get the list of zero tier network members';

    override options: CommandParameter[] | null = [
        {
            name: 'keyword',
            description: 'Search by node id, name or ip',
            type: ApplicationCommandOptionType.String,
            required: false,
            default: "",
            choices: null
        },
        {
            name: 'ephemeral',
            description: 'Should message be only visible to you',
            type: ApplicationCommandOptionType.Boolean,
            required: false,
            default: true,
            choices: null
        }
    ];
    
    async execute(client: Client, interaction: CommandInteraction): Promise<void> {
        const keyword = this.getParameter<string>(interaction, 'keyword');
        const ephemeral = this.getParameter<boolean>(interaction, 'ephemeral');

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
                    ephemeral: ephemeral as boolean
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