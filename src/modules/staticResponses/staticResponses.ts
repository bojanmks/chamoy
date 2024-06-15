const { LAUGHING_CRYING_EMOJI, SALUTE_EMOJI } = require("@modules/shared/constants/emojis");

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
    },
    {
        messages: ['jel pusio boki andriji kurac?', 'jel pusio bojan andriji kurac?', 'jel pusio boki andriji kurac na zakintosu?', 'jel pusio bojan andriji kurac na zakintosu?'],
        response: 'nije'
    },
    {
        messages: ['jesam pusio andriji kurac?', 'jesam pusio andriji kurac?', 'jesam pusio andriji kurac na zakintosu?', 'jesam pusio andriji kurac na zakintosu?'],
        response: 'nisi',
        forUserIds: ['292050833640652801']
    },
    {
        messages: ['jel mi pusio boki kurac?', 'jel mi pusio bojan kurac?', 'jel mi pusio boki kurac na zakintosu?', 'jel mi pusio bojan kurac na zakintosu?'],
        response: 'nije',
        forUserIds: ['478912904691974155']
    },
    {
        messages: ['rnbin sa n'],
        response: `${LAUGHING_CRYING_EMOJI} ${LAUGHING_CRYING_EMOJI} ${LAUGHING_CRYING_EMOJI}`
    }
];