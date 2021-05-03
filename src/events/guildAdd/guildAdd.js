const BaseEvent = require('../../utils/structures/BaseEvent');
const {
    MessageEmbed
} = require('discord.js');

const GuildConfig = require('../../models/guildSettings');
const config = require('../../utils/config/config.json');
const guild = require('../../models/guildSettings');
module.exports = class MessageEvent extends BaseEvent {
    constructor() {
        super({ name: 'guildCreate' });
    }

    async run(client, guild) {
        const oldGuild = await GuildConfig.findOne({ guildID: guild.id });
        if (!oldGuild) {
            try {
                const gConfig = await GuildConfig.create({guildID: guild.id});
            } catch (err) {
                console.log(err);
            }
        }
    }
}