import getDaysLeft from '@modules/usernameDecrement/getDaysLeft';
import getSavedUsername from '@modules/usernameDecrement/getSavedUsername';
import sendDaysLeftMessage from '@modules/usernameDecrement/messages/sendDaysLeftMessage';

export default {
    name: 'timeleft',
    description: 'Returns time left in days',
    deleted: true,
    callback: (client: any, interaction: any) => {
        const username = getSavedUsername();
        const daysLeft = getDaysLeft(username);

        sendDaysLeftMessage(daysLeft, interaction);
    }
};