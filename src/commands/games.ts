import { ApplicationCommandOptionType, Client, CommandInteraction } from 'discord.js';
import useReplying from '@modules/messaging/useReplying';
import useGameEmbeds from '@modules/games/useGameEmbeds';
import useCommands from '@modules/commands/useCommands';
import useRepositories from '@database/repositories/useRepositories';
import { Game } from '@modules/games/models/Game';
import { ICommandParameter } from '@modules/commands/models/ICommandParameter';

const { sendReply } = useReplying();
const { makeGameEmbed } = useGameEmbeds();
const { BaseCommand } = useCommands();
const { gamesRepository } = useRepositories();

class GamesCommand extends BaseCommand {
    name: string = 'games';
    description: string = 'Get game links';
    
    override options?: ICommandParameter[] = [
        {
            name: 'game',
            description: 'Name of the game',
            type: ApplicationCommandOptionType.Number,
            required: true,
            choicesRepositoryOptions: {
                repository: gamesRepository,
                choiceNameGetter: (entity: Game) => entity.name,
                choiceValueGetter: (entity: Game) => entity.id
            }
        }
    ];

    override hasEphemeralParameter?: boolean | undefined = true;
    override ephemeralParameterDefaultValue?: boolean | undefined = false;

    async execute(client: Client, interaction: CommandInteraction): Promise<void> {
        const gameId = this.getParameter<number>(interaction, 'game');
        const ephemeral = this.getParameter<boolean>(interaction, 'ephemeral');

        const embed = await makeGameEmbed(client, gameId!);

        await sendReply(interaction, {
            embeds: [embed!],
            ephemeral: ephemeral!
        });
    }

}

const command = new GamesCommand();

export default command;