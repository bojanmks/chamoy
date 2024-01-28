const { ApplicationCommandOptionType } = require('discord.js');
const gamesRepository = require('@modules/games/gamesRepository');
const generateCommandChoices = require('@modules/commands/generateCommandChoices');
const sendReply = require('@modules/messaging/sendReply');
const generateGameEmbed = require('@modules/games/generateGameEmbed');

module.exports = {
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
    callback: (client, interaction) => {
        const gameId = interaction.options.get('game').value;
        const ephemeral = interaction.options.get('ephemeral')?.value ?? false;

        const embed = generateGameEmbed(client, gameId);

        sendReply(interaction, {
            embeds: [embed],
            ephemeral: ephemeral
        });
    }
};