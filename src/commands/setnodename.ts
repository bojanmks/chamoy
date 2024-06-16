import { ApplicationCommandOptionType, Client, CommandInteraction } from "discord.js";
import sendTextReply from "@modules/messaging/sendTextReply";
import { default as axios } from "axios";
import { zeroTierApiUrl, zeroTierNetworkId } from "../../config.json";
import sendGenericErrorReply from '@modules/errors/messages/sendGenericErrorReply';
import { CHECK_EMOJI } from "@modules/shared/constants/emojis";
import { BaseCommand } from "@modules/commands/models/BaseCommand";
import { CommandParameter } from "@modules/commands/models/CommandParameter";

class SetNodeNameCommand extends BaseCommand {
    name: string = 'setnodename';
    description: string | null = 'Sets a name for a zero tier user';
    
    override options: CommandParameter[] | null = [
        {
            name: 'nodeid',
            description: 'User node ID',
            type: ApplicationCommandOptionType.String,
            required: true,
            default: undefined,
            choices: null
        },
        {
            name: 'name',
            description: 'New name',
            type: ApplicationCommandOptionType.String,
            required: true,
            default: undefined,
            choices: null
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