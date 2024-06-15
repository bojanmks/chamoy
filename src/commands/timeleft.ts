const getDaysLeft = require('@modules/usernameDecrement/getDaysLeft');
const getSavedUsername = require('@modules/usernameDecrement/getSavedUsername');
const sendDaysLeftMessage = require('@modules/usernameDecrement/messages/sendDaysLeftMessage');

module.exports = {
    name: 'timeleft',
    description: 'Returns time left in days',
    deleted: true,
    callback: (client, interaction) => {
        const username = getSavedUsername(getSavedUsername);
        const daysLeft = getDaysLeft(username);

        sendDaysLeftMessage(daysLeft, interaction);
    }
};