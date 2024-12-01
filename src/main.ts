import 'module-alias/register';
import dotenv from "dotenv";
import { Client, IntentsBitField } from 'discord.js';
import eventHandler from '@events/eventHandler';
import useIndiciSettings from '@lib/undici/useUndiciSettings';

dotenv.config();

const client = new Client({
    intents: [
        IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.GuildMembers,
        IntentsBitField.Flags.GuildMessages,
        IntentsBitField.Flags.MessageContent,
        IntentsBitField.Flags.GuildVoiceStates
    ]
});

eventHandler(client);

const { setExtendedTimeoutGlobalDispatcher } = useIndiciSettings();

setExtendedTimeoutGlobalDispatcher();

client.login(process.env.TOKEN);