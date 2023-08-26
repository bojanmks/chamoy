require('dotenv').config();
const { default: axios } = require("axios");
const sendGenericErrorReply = require('../modules/errors/messages/sendGenericErrorReply');
const sendTextReply = require('../modules/messaging/sendTextReply');
const { PRODUCTION_ENVIRONMENT } = require('../modules/shared/constants/environments');

module.exports = {
    name: 'restart',
    description: 'Restarts the bot',
    onlyDevs: true,
    environments: [PRODUCTION_ENVIRONMENT],
    callback: async (client, interaction) => {
        sendTextReply(interaction, ':arrows_counterclockwise: Restarting', true);

        const body = {
            signal: 'restart'
        };

        const headers = {
            'Authorization': 'Bearer ' + process.env.SPARKEDHOST_API_KEY
        };

        await axios.post(process.env.POWER_API_ENDPOINT, body, { headers })
            .catch(error => {
                console.error(`❌ Error restarting the bot: ${error}`);
                sendGenericErrorReply(interaction);
            });
    }
};