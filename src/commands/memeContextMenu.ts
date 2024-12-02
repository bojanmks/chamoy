import { ApplicationCommandType, Client, MessageContextMenuCommandInteraction } from "discord.js";
import useEmbeds from "@modules/embeds/useEmbeds";
import useReplying from "@modules/messaging/useReplying";
import useCommands from "@modules/commands/useCommands";
import useCompleteMeme from "@modules/meme/useCompleteMeme";

const { sendReply } = useReplying();
const { makeBaseEmbed } = useEmbeds();
const { BaseCommand } = useCommands();
const { completeMemeMessageStore } = useCompleteMeme();

class MemeContextMenuCommand extends BaseCommand {
    name: string = 'Meme';
    
    override type: ApplicationCommandType = ApplicationCommandType.Message;
    override hasEphemeralResponse?: boolean | undefined = true;
    
    async execute(client: Client, interaction: MessageContextMenuCommandInteraction): Promise<void> {
        const message = interaction.targetMessage;
        completeMemeMessageStore.addMessage(message.author.id, message.id);

        const embed = makeBaseEmbed(client, 'Message prepared');

        embed.addFields({
            name: 'Complete the meme with:',
            value: '/completememe ``<toptext>`` ``<bottomtext>``',
            inline: false
        });

        await sendReply(interaction, {
            embeds: [embed],
            ephemeral: this.hasEphemeralResponse
        });
    }

}

const command = new MemeContextMenuCommand();

export default command;