const { MAX_USERNAME, ALPHABET } = require("../shared/constants/constants");

module.exports = (username, numberOfDays = 1) => {
    let newUsername = username;

    for (let i = 0; i < numberOfDays; i++) {
        if (!newUsername) break;

        const letters = newUsername.replace(/[^a-z]/gi, '');
        const numbersString = newUsername.replace(/[^0-9]/g, '');

        if (numbersString) {
            newUsername = alterNumbers(letters, numbersString, numberOfDays);
        } else {
            newUsername = alterLetters(letters, numberOfDays);
        }
    }

    if (newUsername === '') {
        newUsername = MAX_USERNAME;
    }

    return newUsername;
};

function alterNumbers(letters, numbersString) {
    let newUsername = letters;

    let numbers = parseInt(numbersString);
    numbers--;

    if (numbers > 0) {
        newUsername += numbers.toString();
    }

    return newUsername;
}

function alterLetters(letters) {
    let charactersArray = letters.split('');
    let lastCharacter = charactersArray.pop();
    
    let characterIndexInAlphabet = ALPHABET.indexOf(lastCharacter);
    characterIndexInAlphabet--;

    let newUsername = charactersArray.join('');
    
    if (characterIndexInAlphabet >= 0) {
        newUsername += ALPHABET[characterIndexInAlphabet];
    }

    return newUsername;
}