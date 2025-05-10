import 'module-alias/register';

import { Client, IntentsBitField } from 'discord.js';

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

    client.login(process.env.TOKEN);
}

setup();