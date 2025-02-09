import { Client } from "discord.js";
import { defaultPresence } from "@modules/presence/presence";
import { onCanChangePresence } from "@modules/presence/presenceRateLimiting";

export default (client: Client) => {
    onCanChangePresence(() => {
        client.user?.setPresence(defaultPresence);
        console.log('✅ Default presence set');
    }, () => {
        console.log('❌ Could not set default presence');
    });
};