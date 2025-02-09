import 'module-alias/register';

import { Client, IntentsBitField } from 'discord.js';
import { setBusy, setNotBusy } from '@modules/busy/busy';

import { DefaultExtractors } from '@discord-player/extractor';
import { Player } from 'discord-player';
import { YoutubeiExtractor } from 'discord-player-youtubei';
import dotenv from "dotenv";
import eventHandler from '@events/eventHandler';
import { setExtendedTimeoutGlobalDispatcher } from '@lib/undici/undiciSettings';

dotenv.config();

const setup = async () => {
    const client = new Client({
        intents: [
            IntentsBitField.Flags.Guilds,
            IntentsBitField.Flags.GuildMembers,
            IntentsBitField.Flags.GuildMessages,
            IntentsBitField.Flags.MessageContent,
            IntentsBitField.Flags.GuildVoiceStates
        ]
    });

    await eventHandler(client);

    setExtendedTimeoutGlobalDispatcher();

    const player = new Player(client);
    await player.extractors.loadMulti([ ...DefaultExtractors, YoutubeiExtractor ]);

    player.events.on('playerStart', (guild) => {
        setBusy(guild.guild.id);
    });

    player.events.on('connectionDestroyed', (guild) => {
        setNotBusy(guild.guild.id);
    });

    player.events.on('emptyQueue', (guild) => {
        setNotBusy(guild.guild.id);
    });

    client.login(process.env.TOKEN);
}

setup();