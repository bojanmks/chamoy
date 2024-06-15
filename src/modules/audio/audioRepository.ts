import audioList from '@assets/data/audio.json';

export default {
    get: () => {
        return audioList.sort((a: any, b: any) => a.name.localeCompare(b.name));
    },
    find: (id: any) => {
        return audioList.find((x: any) => x.id === id);
    }
};