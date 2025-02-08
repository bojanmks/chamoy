import { Client } from "discord.js";
import useBotGuilds from "@modules/guilds/useBotGuilds";

const { refreshGuildsCache } = useBotGuilds();

export default {
    name: 'Bot guilds refresh',
    cronExpression: '0 * * * *',
    callback: async (client: Client) => {
        refreshGuildsCache(client);
    }
};