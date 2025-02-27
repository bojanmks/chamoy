import { ApplicationCommandOptionType, Client, CommandInteraction } from "discord.js";
import { default as axios } from "axios";
import { ICommandParameter } from "@modules/commands/models/ICommandParameter";
import BaseCommand from "@modules/commands/models/BaseCommand";
import { sendTextReply } from "@modules/messaging/replying";
import { sendGenericErrorReply } from "@modules/errors/errorReplying";
import { Emojis } from "@modules/emojis/enums/Emojis";
import { ZERO_TIER_API_URL, ZERO_TIER_NETWORK_ID } from "@modules/zeroTier/constants/zeroTierConstants";

class SetNodeNameCommand extends BaseCommand {
    name: string = 'setnodename';
    description?: string = 'Sets a name for a zero tier user';
    
    override options?: ICommandParameter[] = [
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

    override hasEphemeralResponse?: boolean | undefined = true;

    async execute(client: Client, interaction: CommandInteraction): Promise<void> {
        const nodeId = this.getParameter<string>(interaction, 'nodeid');
        const newName = this.getParameter<string>(interaction, 'name');

        const headers = {
            'Authorization': 'token ' + process.env.ZERO_TIER_API_KEY
        };

        try {
            await axios.post(`${ZERO_TIER_API_URL}/network/${ZERO_TIER_NETWORK_ID}/member/${nodeId}`, { name: newName }, { headers });
            await sendTextReply(interaction, `${Emojis.Check} Updated the node **${nodeId}** name to **${newName}**`);
        }
        catch (error) {
            console.error('❌ Error updating a zero tier node name:');
            console.error(error);
            await sendGenericErrorReply(interaction);
        }
    }
}

const command = new SetNodeNameCommand();

export default command;