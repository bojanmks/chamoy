const changeUserUsername = require("./changeUserUsername");
const getSavedUsername = require("./getSavedUsername");
const saveUsername = require("./saveUsername");
const getUpdatedUsername = require("./getUpdatedUsername");

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