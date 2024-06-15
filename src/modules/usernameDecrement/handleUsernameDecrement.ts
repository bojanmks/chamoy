import changeUserUsername from "@modules/usernameDecrement/changeUserUsername";
import getSavedUsername from "@modules/usernameDecrement/getSavedUsername";
import saveUsername from "@modules/usernameDecrement/saveUsername";
import getUpdatedUsername from "@modules/usernameDecrement/getUpdatedUsername";

export default async (client: any, numberOfDays = 1) => {
    const currentUsername = getSavedUsername();
    const newUsername = getUpdatedUsername(currentUsername, numberOfDays);

    const success = await changeUserUsername(newUsername, client);
    
    if (!success) {
        return false;
    }

    saveUsername(newUsername);
    return newUsername;
};