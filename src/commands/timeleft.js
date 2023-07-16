const getDaysLeft = require('../modules/usernameDecrement/getDaysLeft');
const getSavedUsername = require('../modules/usernameDecrement/getSavedUsername');

module.exports = {
    name: 'timeleft',
    description: 'Returns time left in days',
    callback: (client, interaction) => {
        const username = getSavedUsername(getSavedUsername);
        const daysLeft = getDaysLeft(username);

        interaction.reply(`${daysLeft} days left`);
    }
};