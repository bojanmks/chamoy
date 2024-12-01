import useMessageRecognitionResponses from '@modules/messageRecognitionResponses/useMessageRecognitionResponses';
import stringSimilarity from 'string-similarity';

const { messageRecognitionResponses } = useMessageRecognitionResponses();

const MINIMUM_ACCURACY = .85;

export default async (client: any, message: any) => {
    if (message.author.bot) return;

    if (!messageRecognitionResponses || !messageRecognitionResponses.length) return;

    const exactResponse = getExactResponse(message);
    if (exactResponse) {
        return message.reply(exactResponse.response);
    }

    const recognizedResponse = getRecognizedResponse(message);
    if (recognizedResponse) {
        message.reply(recognizedResponse.response);
    }
}

function getExactResponse(message: any) {
    const messageContent = message.content.trim();

    const exactResponses = applyUserFilter(messageRecognitionResponses.filter((x: any) => x.exact), message.author.id);
    const exactResponse = exactResponses.find((x: any) => (!x.caseSensitive && x.messages.some((msg: any) => msg.toLocaleLowerCase() === messageContent.toLowerCase()))
                                                || (x.caseSensitive && x.messages.some((msg: any) => msg === messageContent)));
    
    return exactResponse;
}

function getRecognizedResponse(message: any) {
    const messageContent = message.content.trim();

    const responsesWithAccuracy = applyUserFilter(messageRecognitionResponses.filter((x: any) => !x.exact), message.author.id).map((x: any) => ({
        messages: x.messages,
        response: x.response,
        accuracy: calculateAccuracy(x.messages, messageContent)
    })).sort((a: any, b: any) => b.accuracy - a.accuracy);

    const mostAccurateResponse = responsesWithAccuracy[0];

    return mostAccurateResponse.accuracy >= MINIMUM_ACCURACY ? mostAccurateResponse : null;
}

function applyUserFilter(responses: any, userId: any) {
    return responses.filter((x: any) => !x.forUserIds || x.forUserIds.includes(userId));
}

function calculateAccuracy(possibleMessages: any, messageContent: any) {
    const calculatedAccuracies = possibleMessages
        .map((msg: any) => calculateSentenceSimilarity(msg.toLocaleLowerCase(), messageContent.toLocaleLowerCase()))
        .sort((a: any, b: any) => b - a);

    return calculatedAccuracies[0];
}

function calculateSentenceSimilarity(sentence1: any, sentence2: any) {
    return stringSimilarity.compareTwoStrings(sentence1, sentence2);
}