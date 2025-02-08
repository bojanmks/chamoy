import { Client } from "discord.js";
import useBotGuilds from "@modules/guilds/useBotGuilds";

const { refreshGuildsCache } = useBotGuilds();

export default (client: Client) => {
    refreshGuildsCache(client);
};