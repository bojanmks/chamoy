import defaultPresence from "@modules/presence/defaultPresence";
import presenceRatelimitUtil from "@modules/presence/presenceRatelimitUtil";

export default (client: any) => {
    presenceRatelimitUtil.onCanChangePresence(() => {
        client.user.setPresence(defaultPresence());
        console.log('✅ Default presence set');
    }, () => {
        console.log('❌ Could not set default presence');
    });
};