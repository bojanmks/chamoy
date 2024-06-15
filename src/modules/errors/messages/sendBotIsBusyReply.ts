import sendTextReply from "@modules/messaging/sendTextReply";
import { BOT_IS_BUSY_ERROR_RESPONSE } from "@modules/errors/messages/errorMessages";

export default (interaction: any) => {
    sendTextReply(interaction, BOT_IS_BUSY_ERROR_RESPONSE, true);
};