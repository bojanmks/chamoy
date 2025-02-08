import { CommandInteraction } from "discord.js";
import useErrorMessages from "./useErrorMessages";
import useReplying from "@modules/messaging/useReplying";

const { sendTextReply } = useReplying();
const { BOT_IS_BUSY_ERROR_RESPONSE, GENERIC_ERROR_RESPONSE, NO_PERMISSION_ERROR_RESPONSE } = useErrorMessages();

const sendBotIsBusyReply = (interaction: any) => {
    return sendTextReply(interaction, BOT_IS_BUSY_ERROR_RESPONSE);
}

const sendGenericErrorReply = (interaction: CommandInteraction) => {
    return sendTextReply(interaction, GENERIC_ERROR_RESPONSE);
}

const sendNoPermissionErrorReply = (interaction: any) => {
    return sendTextReply(interaction, NO_PERMISSION_ERROR_RESPONSE);
}

export default () => {
    return {
        sendBotIsBusyReply,
        sendGenericErrorReply,
        sendNoPermissionErrorReply
    }
}