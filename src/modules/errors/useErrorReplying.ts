import useReplying from "@modules/messaging/useReplying";
import useErrorMessages from "./useErrorMessages";
import { CommandInteraction } from "discord.js";

const { sendTextReply } = useReplying();
const { BOT_IS_BUSY_ERROR_RESPONSE, GENERIC_ERROR_RESPONSE, NO_PERMISSION_ERROR_RESPONSE } = useErrorMessages();

const sendBotIsBusyReply = (interaction: any) => {
    return sendTextReply(interaction, BOT_IS_BUSY_ERROR_RESPONSE, true);
}

const sendGenericErrorReply = (interaction: CommandInteraction) => {
    return sendTextReply(interaction, GENERIC_ERROR_RESPONSE, true);
}

const sendNoPermissionErrorReply = (interaction: any) => {
    return sendTextReply(interaction, NO_PERMISSION_ERROR_RESPONSE, true);
}

export default () => {
    return {
        sendBotIsBusyReply,
        sendGenericErrorReply,
        sendNoPermissionErrorReply
    }
}