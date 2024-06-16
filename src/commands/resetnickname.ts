import getDaysLeft from "@modules/usernameDecrement/getDaysLeft";
import handleUsernameReset from "@modules/usernameDecrement/handleUsernameReset";
import sendGenericErrorReply from "@modules/errors/messages/sendGenericErrorReply";
import sendDaysLeftMessage from "@modules/usernameDecrement/messages/sendDaysLeftMessage";
import { BaseCommand } from "@modules/commands/models/BaseCommand";

class ResetNicknameCommand extends BaseCommand {
    name: string = 'resetnickname';
    description: string | null = 'Resets the nickname';
    
    async callback(client: any, interaction: any): Promise<void> {
        const newUsername = await handleUsernameReset(client, interaction);

        if (!newUsername) {
            return sendGenericErrorReply(interaction);
        }

        const daysLeft = getDaysLeft(newUsername);
        sendDaysLeftMessage(daysLeft, interaction);
    }

}

const command = new ResetNicknameCommand();

export default command;