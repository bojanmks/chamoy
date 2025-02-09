import languages from '@data/tts-languages.json';

export const getTtsLanguges = () => {
    return languages.sort((a: any, b: any) => a.name.localeCompare(b.name));
}

export const findTtsLanguage = (id: any) => {
    return languages.find((x: any) => x.id === id);
}