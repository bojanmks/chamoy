import { Client } from "discord.js";
import { storeDiscordClient } from "@modules/shared/discordClient";

export default async (client: Client) => {
    storeDiscordClient(client);
};