const messageResponses = require('../../data/messageResponses.json');

module.exports = async (client, message) => {
    const messageContent = message.content;
    const responseObject = messageResponses.find(x => responseFindExpression(x, messageContent));

    if (responseObject) {
        message.reply(responseObject.response);
    }
}

function responseFindExpression(el, messageContent) {
    return (!el.caseSensitive && el.message.toLowerCase() === messageContent.toLowerCase())
        || (el.caseSensitive && el.message === messageContent);
}