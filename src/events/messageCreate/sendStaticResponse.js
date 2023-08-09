const staticResponses = require('../../modules/staticResponses/staticResponses');
const stringSimilarity = require('string-similarity');

const MINIMUM_ACCURACY = .7;

module.exports = async (client, message) => {
    if (message.author.bot) return;

    if (!staticResponses || !staticResponses.length) return;

    const messageContent = message.content.trim();

    const exactResponse = getExactResponse(messageContent);
    if (exactResponse) {
        return message.reply(exactResponse.response);
    }

    const recognizedResponse = getRecognizedResponse(messageContent);
    if (recognizedResponse) {
        message.reply(recognizedResponse.response);
    }
}

function getExactResponse(messageContent) {
    const exactResponses = staticResponses.filter(x => x.exact);
    const exactResponse = exactResponses.find(x => (!x.caseSensitive && x.message.toLocaleLowerCase() === messageContent.toLowerCase())
                                                || (x.caseSensitive && x.message === messageContent));
    
    return exactResponse;
}

function getRecognizedResponse(messageContent) {
    const responsesWithAccuracy = staticResponses.filter(x => !x.exact).map(x => ({
        message: x.message,
        response: x.response,
        accuracy: calculateSentenceSimilarity(x.message.toLowerCase(), messageContent.toLowerCase())
    })).sort((a, b) => b.accuracy - a.accuracy);

    const mostAccurateResponse = responsesWithAccuracy[0];

    return mostAccurateResponse.accuracy >= MINIMUM_ACCURACY ? mostAccurateResponse : null;
}

function calculateSentenceSimilarity(sentence1, sentence2) {
    return stringSimilarity.compareTwoStrings(sentence1, sentence2);
}