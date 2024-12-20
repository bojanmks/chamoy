import { default as axios } from "axios";
import { ApplicationCommandOptionType, Client, CommandInteraction } from "discord.js";
import useEmbeds from "@modules/embeds/useEmbeds";
import useReplying from "@modules/messaging/useReplying";
import useErrorReplying from "@modules/errors/useErrorReplying";
import useCommands, { CommandParameter } from "@modules/commands/useCommands";
import useZeroTier from "@modules/zeroTier/useZeroTier";

const { makeBaseEmbed } = useEmbeds();
const { sendReply } = useReplying();
const { sendGenericErrorReply } = useErrorReplying();
const { BaseCommand } = useCommands();
const { ZERO_TIER_API_URL, ZERO_TIER_NETWORK_ID } = useZeroTier();

class IpCommand extends BaseCommand {
    name: string = 'ip';
    description: string = 'Get the list of zero tier network members';

    override options?: CommandParameter[] = [
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
        const ephemeral = this.getParameter<boolean>(interaction, 'ephemeral');

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
                embeds: [embed],
                ephemeral: ephemeral as boolean
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