import languages from '@assets/data/tts-languages.json';

export default {
    get: () => {
        return languages.sort((a: any, b: any) => a.name.localeCompare(b.name));
    },
    find: (id: any) => {
        return languages.find((x: any) => x.id === id);
    }
};