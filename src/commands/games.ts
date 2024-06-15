import { ApplicationCommandOptionType } from 'discord.js';
import gamesRepository from '@modules/games/gamesRepository';
import generateCommandChoices from '@modules/commands/generateCommandChoices';
import sendReply from '@modules/messaging/sendReply';
import generateGameEmbed from '@modules/games/generateGameEmbed';

export default {
    name: 'games',
    description: 'Get game links',
    options: [
        {
            name: 'game',
            description: 'Name of the game',
            type: ApplicationCommandOptionType.Number,
            required: true,
            choices: generateCommandChoices(gamesRepository.get())
        },
        {
            name: 'ephemeral',
            description: 'Should message be only visible to you',
            type: ApplicationCommandOptionType.Boolean
        }
    ],
    callback: (client: any, interaction: any) => {
        const gameId = interaction.options.get('game').value;
        const ephemeral = interaction.options.get('ephemeral')?.value ?? false;

        const embed = generateGameEmbed(client, gameId);

        sendReply(interaction, {
            embeds: [embed],
            ephemeral: ephemeral
        });
    }
};