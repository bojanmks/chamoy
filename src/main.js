require('dotenv').config();
const { Client, IntentsBitField } = require('discord.js');
const eventHandler = require('./handlers/eventHandler');
const scheduleJobs = require('./modules/jobs/scheduleJobs');

const client = new Client({
    intents: [
        IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.GuildMembers,
        IntentsBitField.Flags.GuildMessages,
        IntentsBitField.Flags.MessageContent
    ]
});

eventHandler(client);
scheduleJobs(client);

client.login(process.env.TOKEN);