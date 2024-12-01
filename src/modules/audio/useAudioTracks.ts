import audioList from '@data/audio.json';

const getAudioTracks = () => {
    return audioList.sort((a: any, b: any) => a.name.localeCompare(b.name));
}

const findAudioTrack = (id: any) => {
    return audioList.find((x: any) => x.id === id);
}

export default () => {
    return {
        getAudioTracks,
        findAudioTrack
    }
}