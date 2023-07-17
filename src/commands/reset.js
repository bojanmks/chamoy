const getDaysLeft = require("../modules/usernameDecrement/getDaysLeft");
const handleUsernameReset = require("../modules/usernameDecrement/handleUsernameReset");
const sendGenericErrorReply = require("../modules/errors/messages/sendGenericErrorReply");
const sendDaysLeftMessage = require("../modules/usernameDecrement/messages/sendDaysLeftMessage");

module.exports = {
    name: 'reset',
    description: 'Resets the nickname',
    callback: async (client, interaction) => {
        const newUsername = await handleUsernameReset(client, interaction);

        if (!newUsername) {
            return sendGenericErrorReply(interaction);
        }

        const daysLeft = getDaysLeft(newUsername);
        sendDaysLeftMessage(daysLeft, interaction);
    }
};