const getDaysLeft = require("../modules/usernameDecrement/getDaysLeft");
const handleUsernameReset = require("../modules/usernameDecrement/handleUsernameReset");
const sendGenericErrorReply = require("../errors/sendGenericErrorReply");

module.exports = {
    name: 'reset',
    description: 'Resets the nickname',
    callback: async (client, interaction) => {
        const newUsername = await handleUsernameReset(client, interaction);

        if (!newUsername) {
            return sendGenericErrorReply(interaction);
        }

        const daysLeft = getDaysLeft(newUsername);
        return interaction.reply(`${daysLeft} days left`);
    }
};