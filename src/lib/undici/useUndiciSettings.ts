import { setGlobalDispatcher, Agent } from 'undici';

export default () => {
    return {
        setExtendedTimeoutGlobalDispatcher: () => setGlobalDispatcher(new Agent({ connect: { timeout: 60_000 } }))
    }
}