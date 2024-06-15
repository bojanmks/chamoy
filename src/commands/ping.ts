import sendTextReply from "@modules/messaging/sendTextReply";
import { DEVELOPMENT_ENVIRONMENT } from "@modules/shared/constants/environments";

export default {
    name: 'ping',
    description: '🏓',
    environments: [DEVELOPMENT_ENVIRONMENT],
    callback: (client: any, interaction: any) => {
        sendTextReply(interaction, 'pong', true);
    }
};