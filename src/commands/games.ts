import { ApplicationCommandOptionType, Client, CommandInteraction } from 'discord.js';
import useReplying from '@modules/messaging/useReplying';
import useGames from '@modules/games/useGames';
import useGameEmbeds from '@modules/games/useGameEmbeds';
import useCommands, { CommandParameter } from '@modules/commands/useCommands';
import useCommandChoices from '@modules/commands/useCommandChoices';

const { sendReply } = useReplying();
const { getGames } = useGames();
const { makeGameEmbed } = useGameEmbeds();
const { BaseCommand } = useCommands();
const { makeCommandChoices } = useCommandChoices();

class GamesCommand extends BaseCommand {
    name: string = 'games';
    description: string = 'Get game links';
    
    override options?: CommandParameter[] = [
        {
            name: 'game',
            description: 'Name of the game',
            type: ApplicationCommandOptionType.Number,
            required: true,
            choices: makeCommandChoices(getGames())
        }
    ];

    override hasEphemeralParameter?: boolean | undefined = true;
    override ephemeralParameterDefaultValue?: boolean | undefined = false;

    async execute(client: Client, interaction: CommandInteraction): Promise<void> {
        const gameId = this.getParameter<number>(interaction, 'game');
        const ephemeral = this.getParameter<boolean>(interaction, 'ephemeral');

        const embed = makeGameEmbed(client, gameId!);

        await sendReply(interaction, {
            embeds: [embed!],
            ephemeral: ephemeral!
        });
    }

}

const command = new GamesCommand();

export default command;