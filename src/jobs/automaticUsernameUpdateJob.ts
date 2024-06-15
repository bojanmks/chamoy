
import { PRODUCTION_ENVIRONMENT } from "@modules/shared/constants/environments";
import handleUsernameDecrement from "@modules/usernameDecrement/handleUsernameDecrement";

export default {
    name: 'Automatic username update',
    cronExpression: '0 0 * * *',
    environments: [PRODUCTION_ENVIRONMENT],
    deleted: true,
    callback: async (client: any) => {
        const newUsername = await handleUsernameDecrement(client);
        
        if (newUsername) {
            console.log(`✅ Username was automatically updated to '${newUsername}' at ${new Date().toUTCString()}`);
        }
    }
};