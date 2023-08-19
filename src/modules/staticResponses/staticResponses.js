const { LAUGHING_CRYING_EMOJI, SALUTE_EMOJI } = require("../../constants/emojis");

module.exports = [
    {
        messages: ['koliko kosta daytona?', 'koliko kosta dejtona?'],
        response: 'kosta 50 soma'
    },
    {
        messages: ['koliko teska je torba?'],
        response: 'oko 2 miliona'
    },
    {
        messages: ['vadim ga malo po malo'],
        response: `${LAUGHING_CRYING_EMOJI} ${LAUGHING_CRYING_EMOJI} ${LAUGHING_CRYING_EMOJI}`
    },
    {
        messages: [SALUTE_EMOJI],
        response: SALUTE_EMOJI,
        exact: true
    }
];