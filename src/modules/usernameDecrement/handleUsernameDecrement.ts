const changeUserUsername = require("@modules/usernameDecrement/changeUserUsername");
const getSavedUsername = require("@modules/usernameDecrement/getSavedUsername");
const saveUsername = require("@modules/usernameDecrement/saveUsername");
const getUpdatedUsername = require("@modules/usernameDecrement/getUpdatedUsername");

module.exports = async (client, numberOfDays = 1) => {
    const currentUsername = getSavedUsername(getSavedUsername);
    const newUsername = getUpdatedUsername(currentUsername, numberOfDays);

    const success = await changeUserUsername(newUsername, client);
    
    if (!success) {
        return false;
    }

    saveUsername(newUsername);
    return newUsername;
};