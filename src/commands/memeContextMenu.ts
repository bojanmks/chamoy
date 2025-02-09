import { ApplicationCommandType, Client, MessageContextMenuCommandInteraction } from "discord.js";
import BaseCommand from "@modules/commands/models/BaseCommand";
import { sendReply } from "@modules/messaging/replying";
import { completeMemeMessageStore } from "@modules/meme/completeMeme";
import { makeBaseEmbed } from "@modules/embeds/embeds";

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
            embeds: [embed]
        });
    }

}

const command = new MemeContextMenuCommand();

export default command;