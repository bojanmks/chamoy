import sendReply from "@modules/messaging/sendReply";

export default {
    name: 'chamoy',
    description: '🥶',
    callback: (client: any, interaction: any) => {
        sendReply(interaction, {
            files: [{
                attachment: 'https://cdn.discordapp.com/attachments/961345922300788796/1012484705611939840/chamoy.webm',
                name: 'chamoy.webm'
            }]
        });
    }
};