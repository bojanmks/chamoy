import { ApplicationCommandOptionType, Client, CommandInteraction } from 'discord.js';
import { Game } from '@modules/games/models/Game';
import { ICommandParameter } from '@modules/commands/models/ICommandParameter';
import BaseCommand from '@modules/commands/models/BaseCommand';
import { gamesRepository } from '@database/repositories/repositories';
import { sendReply } from '@modules/messaging/replying';
import { makeGameEmbed } from '@modules/games/gameEmbeds';

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

        const embed = await makeGameEmbed(client, gameId!);

        await sendReply(interaction, {
            embeds: [embed!]
        });
    }

}

const command = new GamesCommand();

export default command;