import { Client } from "discord.js";
import useDiscordClient from "@modules/shared/useDiscordClient";

const { storeDiscordClient } = useDiscordClient();

export default async (client: Client) => {
    storeDiscordClient(client);
};