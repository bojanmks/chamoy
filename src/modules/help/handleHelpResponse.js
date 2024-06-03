const { devs } = require('../../../config.json');
const getLocalCommands = require("@modules/commands/getLocalCommands");
const sendReply = require("@modules/messaging/sendReply");
const generateBaseEmbed = require('@modules/embeds/generateBaseEmbed');
const { ButtonBuilder, ButtonStyle, ComponentType, ActionRowBuilder } = require('discord.js');
const { CURRENT_ENVIRONMENT } = require("@modules/shared/constants/environments");
const sendGenericErrorReply = require("@modules/errors/messages/sendGenericErrorReply");

const COMMANDS_PER_PAGE = 10;

module.exports = async (client, interaction, userId) => {
    const commands = getLocalCommands(['commands'])
        .filter(x => isCommandAvailable(x, userId))
        .sort((a, b) => a.name.localeCompare(b.name));

    if (!commands || !commands.length) {
        sendGenericErrorReply(interaction);
        return;
    }

    const message = generateMessage(client, commands);
    const sentMessage = await sendReply(interaction, message);

    const collector = sentMessage.createMessageComponentCollector({ componentType: ComponentType.Button });
    
    collector.on('collect', async existingInteraction => {
        goToPage(client, existingInteraction, commands, parseInt(existingInteraction.customId));
    });
}

function isCommandAvailable(command, userId) {
    if (command.environments && !command.environments.includes(CURRENT_ENVIRONMENT)) {
        return false;
    }

    if (command.onlyDevs && !devs.includes(userId)) {
        return false;
    }

    return true;
}

function generateMessage(client, commands, page = 0) {
    const embed = generateBaseEmbed(client, 'Commands');

    for (let command of commands.slice(COMMANDS_PER_PAGE * page, COMMANDS_PER_PAGE * (page + 1))) {
        embed.addFields({
            name: commandNameWithParameters(command),
            value: command.description,
            inline: false
        });
    }

    const actions = generateMessageActions(commands, page);

    return {
        embeds: [embed],
        components: [actions],
        ephemeral: true
    };
}

function commandNameWithParameters(command) {
    let commandName = "/" + command.name;

    if (!command.options?.length) {
        return commandName;
    }

    // required parameters
    for (let param of command.options.filter(x => x.required)) {
        commandName += ` \`\`<${param.name}>\`\``;
    }

    // optional parameters
    for (let param of command.options.filter(x => !x.required)) {
        commandName += ` \`\`[${param.name}]\`\``;
    }

    return commandName;
}

const BACK_BUTTON = new ButtonBuilder()
    .setStyle(ButtonStyle.Secondary)
    .setLabel('Previous')
    .setEmoji('⬅️');

const FORWARD_BUTTON = new ButtonBuilder()
    .setStyle(ButtonStyle.Secondary)
    .setLabel('Next')
    .setEmoji('➡️');

function generateMessageActions(commands, page) {
    const actions = new ActionRowBuilder();

    const isFirstPage = page === 0;
    const isLastPage = commands.length <= (page + 1) * COMMANDS_PER_PAGE;

    if (!isFirstPage) {
        BACK_BUTTON.setCustomId((page - 1).toString());
        actions.addComponents(BACK_BUTTON);
    }

    if (!isLastPage) {
        FORWARD_BUTTON.setCustomId((page + 1).toString());
        actions.addComponents(FORWARD_BUTTON);
    }

    return actions;
}

function goToPage(client, interaction, commands, page) {
    const message = generateMessage(client, commands, page);
    interaction.update(message);
}