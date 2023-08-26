
const { MAX_USERNAME } = require("../shared/constants/constants");
const changeUserUsername = require("./changeUserUsername");
const saveUsername = require("./saveUsername");

module.exports = async (client, interaction) => {
    const newUsername = MAX_USERNAME;

    const success = await changeUserUsername(newUsername, client);

    if (!success) {
        return false;
    }

    saveUsername(newUsername);
    return newUsername;
};