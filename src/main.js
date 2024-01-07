require('dotenv').config();
require('module-alias/register');
const { Client, IntentsBitField } = require('discord.js');
const eventHandler = require('@events/eventHandler');
const setDefaultGlobalDispatcher = require('@modules/undici/setDefaultGlobalDispatcher');
const setupExpressServer = require('@express/setupExpressServer');

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
setupExpressServer();

client.login(process.env.TOKEN);