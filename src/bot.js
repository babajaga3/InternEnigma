require('dotenv').config();
const { Client, Message, Collection } = require('discord.js');
const { registerCommands, registerEvents } = require('./utils/registry');
const client = new Client({
    ws: {
        intents: [
            "GUILDS",
            "GUILD_MEMBERS",
            "GUILD_BANS",
            "GUILD_EMOJIS",
            "GUILD_INTEGRATIONS",
            "GUILD_WEBHOOKS",
            "GUILD_INVITES",
            "GUILD_VOICE_STATES",
            "GUILD_PRESENCES",
            "GUILD_MESSAGES",
            "GUILD_MESSAGE_REACTIONS",
            "GUILD_MESSAGE_TYPING",
            "DIRECT_MESSAGES",
            "DIRECT_MESSAGE_REACTIONS",
            "DIRECT_MESSAGE_TYPING"
        ]
    },
    fetchAllMembers: false,
    disableMentions: 'everyone',
});


(async (message) => {
    client.guildSettings = new Collection();
    client.commands = new Map();
    client.events = new Map();
    await registerCommands(client, '../commands');
    await registerEvents(client, '../events');
    await client.login(process.env.INTERN_ENIGMA);
})();
