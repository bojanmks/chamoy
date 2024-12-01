import { ApplicationCommandOptionType, Client, CommandInteraction } from "discord.js";
import { default as axios } from "axios";
import { zeroTierApiUrl, zeroTierNetworkId } from "../../config.json";
import useReplying from "@modules/messaging/useReplying";
import useEmojis from "@modules/emojis/useEmojis";
import useErrorReplying from "@modules/errors/useErrorReplying";
import useCommands, { CommandParameter } from "@modules/commands/useCommands";

const { sendTextReply } = useReplying();
const { CHECK_EMOJI } = useEmojis();
const { sendGenericErrorReply } = useErrorReplying();
const { BaseCommand } = useCommands();

class SetNodeNameCommand extends BaseCommand {
    name: string = 'setnodename';
    description?: string = 'Sets a name for a zero tier user';
    
    override options?: CommandParameter[] = [
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
    ];

    async execute(client: Client, interaction: CommandInteraction): Promise<void> {
        const nodeId = this.getParameter<string>(interaction, 'nodeid');
        const newName = this.getParameter<string>(interaction, 'name');

        const headers = {
            'Authorization': 'token ' + process.env.ZERO_TIER_API_KEY
        };

        await axios.post(`${zeroTierApiUrl}/network/${zeroTierNetworkId}/member/${nodeId}`, { name: newName }, { headers })
            .then((_: any) => {
                sendTextReply(interaction, `${CHECK_EMOJI} Updated the node **${nodeId}** name to **${newName}**`, true);
            })
            .catch((error: any) => {
                console.error('❌ Error updating a zero tier node name:');
                console.error(error);
                sendGenericErrorReply(interaction);
            });
    }
}

const command = new SetNodeNameCommand();

export default command;