import { ApplicationCommandOptionType } from 'discord.js';
import getDaysLeft from '@modules/usernameDecrement/getDaysLeft';
import handleUsernameDecrement from '@modules/usernameDecrement/handleUsernameDecrement';
import sendGenericErrorReply from '@modules/errors/messages/sendGenericErrorReply';
import sendDaysLeftMessage from '@modules/usernameDecrement/messages/sendDaysLeftMessage';
import { BaseCommand } from '@modules/commands/models/BaseCommand';

class UpdateNicknameCommand extends BaseCommand {
    name: string = 'updatenickname';
    description: string | null = 'Skips the specified number of days, or 1 by default';
    override deleted: boolean = true;
    
    async callback(client: any, interaction: any): Promise<void> {
        const numberOfDays = getNumberOfDaysParameter(interaction);
        const newUsername = await handleUsernameDecrement(client, numberOfDays);

        if (!newUsername) {
            return sendGenericErrorReply(interaction);
        }

        const daysLeft = getDaysLeft(newUsername);
        sendDaysLeftMessage(daysLeft, interaction);
    }

}

function getNumberOfDaysParameter(interaction: any) {
    let numberOfDays = interaction.options.get('days')?.value ?? 1;

    if (numberOfDays < 1) {
        numberOfDays = 1;
    }

    return numberOfDays;
}

const command = new UpdateNicknameCommand();

export default command;