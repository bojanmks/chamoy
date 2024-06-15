const { setGlobalDispatcher, Agent } = require('undici');

module.exports = () => {
    setGlobalDispatcher(new Agent({ connect: { timeout: 60_000 } }));
};