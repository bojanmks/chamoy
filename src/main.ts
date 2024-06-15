import 'module-alias/register';
import dotenv from "dotenv";
import { Client, IntentsBitField } from 'discord.js';
import eventHandler from '@events/eventHandler';
import setDefaultGlobalDispatcher from '@modules/undici/setDefaultGlobalDispatcher';

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
setDefaultGlobalDispatcher();

client.login(process.env.TOKEN);