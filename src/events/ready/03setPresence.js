const defaultPresence = require("../../modules/presence/defaultPresence");

module.exports = (client) => {
    client.user.setPresence(defaultPresence());
    console.log('✅ Default presence set');
};