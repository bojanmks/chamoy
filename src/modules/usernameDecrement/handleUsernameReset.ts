const { MAX_USERNAME } = require("@modules/shared/constants/constants");
const changeUserUsername = require("@modules/usernameDecrement/changeUserUsername");
const saveUsername = require("@modules/usernameDecrement/saveUsername");

export default async (client: any, interaction: any) => {
    const newUsername = MAX_USERNAME;

    const success = await changeUserUsername(newUsername, client);

    if (!success) {
        return false;
    }

    saveUsername(newUsername);
    return newUsername;
};