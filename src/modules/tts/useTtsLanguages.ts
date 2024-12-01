import languages from '@data/tts-languages.json';

const getTtsLanguges = () => {
    return languages.sort((a: any, b: any) => a.name.localeCompare(b.name));
}

const findTtsLanguage = (id: any) => {
    return languages.find((x: any) => x.id === id);
}

export default () => {
    return {
        getTtsLanguges,
        findTtsLanguage
    }
}