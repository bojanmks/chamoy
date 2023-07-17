const { ApplicationCommandOptionType } = require('discord.js');
const getDaysLeft = require('../modules/usernameDecrement/getDaysLeft');
const handleUsernameDecrement = require('../modules/usernameDecrement/handleUsernameDecrement');
const sendGenericErrorReply = require('../modules/errors/messages/sendGenericErrorReply');
const sendDaysLeftMessage = require('../modules/usernameDecrement/messages/sendDaysLeftMessage');

module.exports = {
    name: 'skip',
    description: 'Skips the specified number of days, or 1 by default',
    options: [
        {
            name: 'days',
            description: 'Number of days to skip',
            type: ApplicationCommandOptionType.Number
        }
    ],
    callback: async (client, interaction) => {
        const numberOfDays = getNumberOfDaysParameter(interaction);
        const newUsername = await handleUsernameDecrement(client, numberOfDays);

        if (!newUsername) {
            return sendGenericErrorReply(interaction);
        }

        const daysLeft = getDaysLeft(newUsername);
        sendDaysLeftMessage(daysLeft, interaction);
    }
};

function getNumberOfDaysParameter(interaction) {
    let numberOfDays = interaction.options.get('days')?.value ?? 1;

    if (numberOfDays < 1) {
        numberOfDays = 1;
    }

    return numberOfDays;
}