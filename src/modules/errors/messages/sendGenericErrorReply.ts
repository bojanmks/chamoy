import sendTextReply from "@modules/messaging/sendTextReply";
import { GENERIC_ERROR_RESPONSE } from "@modules/errors/messages/errorMessages";

export default (interaction: any) => {
    sendTextReply(interaction, GENERIC_ERROR_RESPONSE, true);
};