import { ApplicationCommandOptionType, ChannelType, Client, CommandInteraction } from "discord.js";
import { ICommandParameter } from "@modules/commands/models/ICommandParameter";
import { ICommandUserResponse } from "@modules/commands/models/ICommandUserResponse";
import BaseCommand from "@modules/commands/models/BaseCommand";
import { sendTextReply } from "@modules/messaging/replying";
import { Emojis } from "@modules/emojis/enums/Emojis";

class SayCommand extends BaseCommand {
    name: string = 'say';
    description?: string = 'Make bot send a message';

    override options?: ICommandParameter[] = [
        {
            name: 'message',
            description: 'Message to send',
            type: ApplicationCommandOptionType.String,
            required: true
        }
    ];

    override userResponses?: ICommandUserResponse[] = [
        {
            userId: '478912904691974155',
            response: `desi ti jbt ${Emojis.Clown}`
        }
    ];

    override hasEphemeralResponse?: boolean | undefined = true;
    
    async execute(client: Client, interaction: CommandInteraction): Promise<void> {
        const messageToSend = this.getParameter<string>(interaction, 'message')!;

        if (interaction.channel?.type === ChannelType.GuildText) {
            interaction.channel?.send(messageToSend);
        }

        await sendTextReply(interaction, `${Emojis.Check} Message sent`);
    }
}

const command = new SayCommand();

export default command;