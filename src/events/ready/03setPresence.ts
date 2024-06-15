const defaultPresence = require("@modules/presence/defaultPresence");
const presenceRatelimitUtil = require("@modules/presence/presenceRatelimitUtil");

module.exports = (client) => {
    presenceRatelimitUtil.onCanChangePresence(() => {
        client.user.setPresence(defaultPresence());
        console.log('✅ Default presence set');
    }, () => {
        console.log('❌ Could not set default presence');
    });
};