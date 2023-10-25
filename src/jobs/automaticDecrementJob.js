
const { PRODUCTION_ENVIRONMENT } = require("../modules/shared/constants/environments");
const handleUsernameDecrement = require("../modules/usernameDecrement/handleUsernameDecrement");

module.exports = {
    name: 'Automatic Decrement',
    cronExpression: '0 0 * * *',
    environments: [PRODUCTION_ENVIRONMENT],
    callback: async (client) => {
        const newUsername = await handleUsernameDecrement(client);
        console.log(`✅ Username was automatically updated to '${newUsername}' at ${new Date().toUTCString()}`);
    }
};