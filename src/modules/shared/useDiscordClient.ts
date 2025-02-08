import { Client } from "discord.js";

let client: Client;

const storeDiscordClient = (c: Client) => {
    client = c;
}

const getDiscordClient = () => {
    return client;
}

const useDiscordClient = () => {
    return {
        storeDiscordClient,
        getDiscordClient
    }
}

export default useDiscordClient;