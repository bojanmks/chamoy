import { ApplicationCommandOptionType, Client, CommandInteraction } from 'discord.js';
import gamesRepository from '@modules/games/gamesRepository';
import generateCommandChoices from '@modules/commands/generateCommandChoices';
import sendReply from '@modules/messaging/sendReply';
import generateGameEmbed from '@modules/games/generateGameEmbed';
import { BaseCommand } from '@modules/commands/models/BaseCommand';
import { CommandParameter } from '@modules/commands/models/CommandParameter';

class GamesCommand extends BaseCommand {
    name: string = 'games';
    description: string = 'Get game links';
    
    override options: CommandParameter[] | null = [
        {
            name: 'game',
            description: 'Name of the game',
            type: ApplicationCommandOptionType.Number,
            required: true,
            choices: generateCommandChoices(gamesRepository.get()),
            default: undefined
        },
        {
            name: 'ephemeral',
            description: 'Should message be only visible to you',
            type: ApplicationCommandOptionType.Boolean,
            required: false,
            choices: null,
            default: false
        }
    ];

    execute(client: Client, interaction: CommandInteraction): void {
        const gameId = this.getParameter<number>(interaction, 'game');
        const ephemeral = this.getParameter<boolean>(interaction, 'ephemeral');

        const embed = generateGameEmbed(client, gameId);

        sendReply(interaction, {
            embeds: [embed!],
            ephemeral: ephemeral!
        });
    }

}

const command = new GamesCommand();

export default command;