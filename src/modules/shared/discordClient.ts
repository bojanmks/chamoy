import { Client } from "discord.js";

let client: Client;

export const storeDiscordClient = (c: Client) => {
    client = c;
}

export const getDiscordClient = () => {
    return client;
}