module.exports = async (client, message) => {
    if (message.content.toLowerCase() === 'koliko kosta daytona?') {
        message.reply('kosta 50 soma');
    }

    if (message.content.toLowerCase() === 'koliko teska je torba?') {
        message.reply('oko 2 miliona');
    }
}