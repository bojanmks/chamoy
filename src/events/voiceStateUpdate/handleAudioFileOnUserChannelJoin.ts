import { VoiceConnection, createAudioResource, joinVoiceChannel } from "@discordjs/voice";
import { MyAudioPlayer } from "@modules/audio/MyAudioPlayer";
import audioFileUserMap from "@modules/audioFileOnUserChannelJoin/audioFileUserMap";
import busyUtil from "@modules/busy/busyUtil";
import { VoiceState } from "discord.js";
import path from "path";

export default async (client: any, oldState: VoiceState, newState: VoiceState) => {
    if (!newState.channel?.id) {
        return;
    }

    const channelId: string = newState.channel.id;
    const userId: string = newState.id;
    const serverId: string = newState.guild.id;

    if (busyUtil.isBusy(serverId)) {
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
        busyUtil.setBusy(serverId);

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
            busyUtil.toggleBusy(serverId);
        });
    } catch (error) {
        connection?.disconnect();
        busyUtil.setNotBusy(serverId);
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