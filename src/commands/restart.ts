import { default as axios } from "axios";
import sendGenericErrorReply from '@modules/errors/messages/sendGenericErrorReply';
import sendTextReply from '@modules/messaging/sendTextReply';
import { PRODUCTION_ENVIRONMENT } from '@modules/shared/constants/environments';

module.exports = {
    name: 'restart',
    description: 'Restarts the bot',
    onlyDevs: true,
    environments: [PRODUCTION_ENVIRONMENT],
    callback: async (client: any, interaction: any) => {
        sendTextReply(interaction, ':arrows_counterclockwise: Restarting', true);

        const body = {
            signal: 'restart'
        };

        const headers = {
            'Authorization': 'Bearer ' + process.env.SPARKEDHOST_API_KEY
        };

        await axios.post(process.env.POWER_API_ENDPOINT!, body, { headers })
            .catch((error: any) => {
                console.error('❌ Error restarting the bot:');
                console.error(error);
                sendGenericErrorReply(interaction);
            });
    }
};