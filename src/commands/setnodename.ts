import { ApplicationCommandOptionType, Client, CommandInteraction } from "discord.js";
import sendTextReply from "@modules/messaging/sendTextReply";
import { default as axios } from "axios";
import { zeroTierApiUrl, zeroTierNetworkId } from "../../config.json";
import sendGenericErrorReply from '@modules/errors/messages/sendGenericErrorReply';
import { CHECK_EMOJI } from "@modules/shared/constants/emojis";
import { BaseCommand } from "@modules/commands/models/BaseCommand";

class SetNodeNameCommand extends BaseCommand {
    name: string = 'setnodename';
    description: string | null = 'Sets a name for a zero tier user';
    
    override options: any[] | null = [
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
        const nodeId = interaction.options.get('nodeid')!.value;
        const newName = interaction.options.get('name')!.value;

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