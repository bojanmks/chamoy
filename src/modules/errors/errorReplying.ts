import { BOT_IS_BUSY_ERROR_RESPONSE, GENERIC_ERROR_RESPONSE, NO_PERMISSION_ERROR_RESPONSE } from "./constants/errorMessages";

import { CommandInteraction } from "discord.js";
import { sendTextReply } from "@modules/messaging/replying";

export const sendBotIsBusyReply = (interaction: any) => {
    return sendTextReply(interaction, BOT_IS_BUSY_ERROR_RESPONSE);
}

export const sendGenericErrorReply = (interaction: CommandInteraction) => {
    return sendTextReply(interaction, GENERIC_ERROR_RESPONSE);
}

export const sendNoPermissionErrorReply = (interaction: any) => {
    return sendTextReply(interaction, NO_PERMISSION_ERROR_RESPONSE);
}