import usePresence from "@modules/presence/usePresence";
import usePresenceRateLimiting from "@modules/presence/usePresenceRateLimiting";

const { defaultPresence } = usePresence();
const { onCanChangePresence } = usePresenceRateLimiting();

export default (client: any) => {
    onCanChangePresence(() => {
        client.user.setPresence(defaultPresence);
        console.log('✅ Default presence set');
    }, () => {
        console.log('❌ Could not set default presence');
    });
};