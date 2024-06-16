import sendTextReply from "@modules/messaging/sendTextReply";
import { GENERIC_ERROR_RESPONSE } from "@modules/errors/messages/errorMessages";
import { CommandInteraction } from "discord.js";

export default (interaction: CommandInteraction) => {
    sendTextReply(interaction, GENERIC_ERROR_RESPONSE, true);
};