const sendReply = require("../modules/messaging/sendReply");

module.exports = {
    name: 'chamoy',
    description: '🥶',
    callback: (client, interaction) => {
        sendReply(interaction, {
            files: [{
                attachment: 'https://cdn.discordapp.com/attachments/961345922300788796/1012484705611939840/chamoy.webm',
                name: 'chamoy.webm'
            }]
        });
    }
};