import { default as axios } from "axios";
import { ApplicationCommandOptionType, Client, CommandInteraction } from "discord.js";
import { ICommandParameter } from "@modules/commands/models/ICommandParameter";
import BaseCommand from "@modules/commands/models/BaseCommand";
import { sendReply } from "@modules/messaging/replying";
import { sendGenericErrorReply } from "@modules/errors/errorReplying";
import { makeBaseEmbed } from "@modules/embeds/embeds";
import { ZERO_TIER_API_URL, ZERO_TIER_NETWORK_ID } from "@modules/zeroTier/constants/zeroTierConstants";

class IpCommand extends BaseCommand {
    name: string = 'ip';
    description: string = 'Get the list of zero tier network members';

    override options?: ICommandParameter[] = [
        {
            name: 'keyword',
            description: 'Search by node id, name or ip',
            type: ApplicationCommandOptionType.String,
            default: ""
        }
    ];

    override hasEphemeralParameter?: boolean | undefined = true;
    override ephemeralParameterDefaultValue?: boolean | undefined = true;
    
    async execute(client: Client, interaction: CommandInteraction): Promise<void> {
        const keyword = this.getParameter<string>(interaction, 'keyword');

        const headers = {
            'Authorization': 'token ' + process.env.ZERO_TIER_API_KEY
        };

        try {
            const response = await axios.get(`${ZERO_TIER_API_URL}/network/${ZERO_TIER_NETWORK_ID}/member`, { headers });

            const members = response.data.filter((x: any) =>
                x.nodeId?.includes(keyword)
                || x.name?.includes(keyword)
                || x.config?.ipAssignments.some((ipAs: any) => ipAs.includes(keyword))
            );

            const embed = makeBaseEmbed(client, 'IP');
            generateEmbed(embed, members);

            await sendReply(interaction, {
                embeds: [embed]
            });
        }
        catch (error) {
            console.error('❌ Error fetching zero tier members:');
            console.error(error);
            await sendGenericErrorReply(interaction);
        }
    }

}

function generateEmbed(embed: any, members: any) {
    embed.addFields(
        {
            name: 'Network ID',
            value: ZERO_TIER_NETWORK_ID
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