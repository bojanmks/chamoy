import { setGlobalDispatcher, Agent } from 'undici';

export default () => {
    setGlobalDispatcher(new Agent({ connect: { timeout: 60_000 } }));
};