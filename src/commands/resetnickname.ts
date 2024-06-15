import getDaysLeft from "@modules/usernameDecrement/getDaysLeft";
import handleUsernameReset from "@modules/usernameDecrement/handleUsernameReset";
import sendGenericErrorReply from "@modules/errors/messages/sendGenericErrorReply";
import sendDaysLeftMessage from "@modules/usernameDecrement/messages/sendDaysLeftMessage";

export default {
    name: 'resetnickname',
    description: 'Resets the nickname',
    deleted: true,
    callback: async (client: any, interaction: any) => {
        const newUsername = await handleUsernameReset(client, interaction);

        if (!newUsername) {
            return sendGenericErrorReply(interaction);
        }

        const daysLeft = getDaysLeft(newUsername);
        sendDaysLeftMessage(daysLeft, interaction);
    }
};