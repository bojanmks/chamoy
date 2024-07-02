import { AudioPlayerStatus, AudioResource, NoSubscriberBehavior, createAudioPlayer } from "@discordjs/voice";

export class MyAudioPlayer {
    playAudio(connection: any, audioResource: AudioResource, onFinish: any) {
        const audioPlayer = createAudioPlayer({
            behaviors: {
                noSubscriber: NoSubscriberBehavior.Pause
            }
        });
    
        connection.subscribe(audioPlayer);
    
        audioPlayer.play(audioResource);
    
        audioPlayer.on(AudioPlayerStatus.Idle, () => {
            if (onFinish) {
                onFinish();
            }
        });
    }
}