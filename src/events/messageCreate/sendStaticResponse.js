const messageResponses = require('../../data/messageResponses.json');
const stringSimilarity = require('string-similarity');

const MINIMUM_ACCURACY = .7;

module.exports = async (client, message) => {
    if (message.author.bot) return;

    if (!messageResponses || !messageResponses.length) return;

    const messageContent = message.content;
    const responseObject = getRecognizedMessage(messageContent);

    if (responseObject) {
        message.reply(responseObject.response);
    }
}

function getRecognizedMessage(messageContent) {
    const responsesWithAccuracy = messageResponses.map(x => ({
        message: x.message,
        response: x.response,
        accuracy: calculateSentenceSimilarity(x.message, messageContent)
    })).sort((a, b) => b.accuracy - a.accuracy);

    const mostAccurateResponse = responsesWithAccuracy[0];

    return mostAccurateResponse.accuracy >= MINIMUM_ACCURACY ? mostAccurateResponse : null;
}

function calculateSentenceSimilarity(sentence1, sentence2) {
    return stringSimilarity.compareTwoStrings(sentence1, sentence2);
}