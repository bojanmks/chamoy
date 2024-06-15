import sendTextReply from "@modules/messaging/sendTextReply";
import { NO_PERMISSION_ERROR_RESPONSE } from "@modules/errors/messages/errorMessages";

export default (interaction: any) => {
    sendTextReply(interaction, NO_PERMISSION_ERROR_RESPONSE, true);
};