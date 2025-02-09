import { Agent, setGlobalDispatcher } from 'undici';

export const setExtendedTimeoutGlobalDispatcher = () => setGlobalDispatcher(new Agent({ connect: { timeout: 60_000 } }));