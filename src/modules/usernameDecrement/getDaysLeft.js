const { ALPHABET } = require("../shared/constants/constants");


module.exports = (username) => {
    let daysLeft = 0;

    const letters = username.replace(/[^a-z]/gi, '');
    const numbersString = username.replace(/[^0-9]/g, '');

    for (const char of letters) {
        let characterIndexInAlphabet = ALPHABET.indexOf(char);
        daysLeft += characterIndexInAlphabet + 1;
    }

    if (numbersString) {
        daysLeft += parseInt(numbersString);
    }

    return daysLeft;
};