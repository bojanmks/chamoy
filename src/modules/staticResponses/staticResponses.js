const { LAUGHING_CRYING_EMOJI, SALUTE_EMOJI } = require("../../constants/emojis");

module.exports = [
    {
        message: 'koliko kosta daytona?',
        response: 'kosta 50 soma'
    },
    {
        message: 'koliko teska je torba?',
        response: 'oko 2 miliona'
    },
    {
        message: 'vadim ga malo po malo',
        response: `${LAUGHING_CRYING_EMOJI} ${LAUGHING_CRYING_EMOJI} ${LAUGHING_CRYING_EMOJI}`
    },
    {
        message: '🫡',
        response: SALUTE_EMOJI,
        exact: true
    }
];