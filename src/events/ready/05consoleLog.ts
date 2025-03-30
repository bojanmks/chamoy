import { Client } from "discord.js";

export default (client: Client) => {
    console.log(`🤖 ${client.user?.username} is online`);
};