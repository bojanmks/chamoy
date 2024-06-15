import games from '@assets/data/games.json';

export default {
    get: () => {
        return games.filter((x: any) => !x.deleted).sort((a: any, b: any) => a.name.localeCompare(b.name));
    },
    find: (id: any) => {
        return games.find((x: any) => x.id === id);
    }
};