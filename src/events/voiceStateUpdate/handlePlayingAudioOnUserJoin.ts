import { VoiceConnection, createAudioResource, joinVoiceChannel } from "@discordjs/voice";
import useAudioPlayer from "@modules/audio/useAudioPlayer";
import usePlayingAudioOnUserJoin from "@modules/audioFileOnUserChannelJoin/usePlayingAudioOnUserJoin";
import useBusy from "@modules/busy/useBusy";
import { Client, VoiceState } from "discord.js";
import path from "path";

const { isBusy, setBusy, setNotBusy } = useBusy();
const { MyAudioPlayer } = useAudioPlayer();
const { audioFileUserMap } = usePlayingAudioOnUserJoin();

export default async (client: Client, oldState: VoiceState, newState: VoiceState) => {
    if (newState.member?.user.bot) {
        return;
    }

    if (!newState.channel?.id) {
        return;
    }

    if (oldState.channel?.id) {
        return;
    }

    const channelId: string = newState.channel.id;
    const userId: string = newState.id;
    const serverId: string = newState.guild.id;

    if (isBusy(serverId)) {
        return;
    }

    const usersAudioFiles = audioFileUserMap.find(x => x.userId === userId && !x.deleted)?.audioFiles;

    if (!usersAudioFiles?.length) {
        return;
    }

    const audioFileToPlay = getRandomAudioFile(usersAudioFiles);

    if (!audioFileToPlay) {
        return;
    }

    let connection: VoiceConnection | undefined;

    try {
        setBusy(serverId);

        connection = joinVoiceChannel({
            channelId: channelId,
            guildId: serverId,
            adapterCreator: newState.guild.voiceAdapterCreator
        });

        const relativeFilePath = `./src/assets/audio/${audioFileToPlay.fileName}`;
        const absoluteFilePath = path.resolve(relativeFilePath);
        const audioResource = createAudioResource(absoluteFilePath);

        const audioPlayer = new MyAudioPlayer();

        audioPlayer.playAudio(connection, audioResource, () => {
            connection?.disconnect();
            setNotBusy(serverId);
        });
    } catch (error) {
        connection?.disconnect();
        setNotBusy(serverId);
        throw error;
    }
}

function getRandomAudioFile(audioFiles: any[]): any {
    const totalChance = audioFiles.reduce((sum, file) => sum + file.chance, 0);

    if (totalChance > 100) {
        throw new Error('Total chance for audio files for user exceeds 100.');
    }

    const randomNumber = Math.random() * 100;

    if (randomNumber > totalChance) {
        return null;
    }

    let cumulativeChance = 0;
    for (const file of audioFiles) {
        cumulativeChance += file.chance;
        if (randomNumber <= cumulativeChance) {
            return file;
        }
    }

    return null;
}