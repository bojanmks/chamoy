import { ApplicationCommandOptionType, ChannelType, Client, CommandInteraction } from "discord.js";
import useReplying from "@modules/messaging/useReplying";
import useEmojis from "@modules/emojis/useEmojis";
import useCommands from "@modules/commands/useCommands";
import { ICommandParameter } from "@modules/commands/models/ICommandParameter";
import { ICommandUserResponse } from "@modules/commands/models/ICommandUserResponse";

const { sendTextReply } = useReplying();
const { CHECK_EMOJI, CLOWN_EMOJI } = useEmojis();
const { BaseCommand } = useCommands();

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
            response: `desi ti jbt ${CLOWN_EMOJI}`
        }
    ];

    override hasEphemeralResponse?: boolean | undefined = true;
    
    async execute(client: Client, interaction: CommandInteraction): Promise<void> {
        const messageToSend = this.getParameter<string>(interaction, 'message')!;

        if (interaction.channel?.type === ChannelType.GuildText) {
            interaction.channel?.send(messageToSend);
        }

        await sendTextReply(interaction, `${CHECK_EMOJI} Message sent`, true);
    }
}

const command = new SayCommand();

export default command;