const BaseCommand = require('../../utils/structures/BaseCommand.js');
const emoji = require('../../utils/config/emojis.json');
const { messageOrEmbed } = require("../../utils/models/converter.js");
require('dotenv').config()
const config = require('../../utils/config/config.json');

module.exports = class PrefixCommand extends BaseCommand {
    constructor() {
        super({
            name: "prefix",
            description: "Sets a new prefix (case sensitive)",
            category: "Settings",
            usage: "<new prefix>",
            permissions: ['ADMINISTRATOR'],
            cooldown: 300,
            aliases: ['pr']
        });
    }

    async run(client, message, args) {
        let setPrefix = args[0];
		const data = await this.getGuildDataDB(message.channel.guild.id);
    
		let CacheData = client.guildSettings.get(message.channel.guild.id);
		let newPrefix = config.prefix;
		if(CacheData) {
			newPrefix = CacheData?.prefix;
		}
		const res = args[0];

		if(!res) {
			return messageOrEmbed(client, `Please specify a new prefix`, message);

		}

		if(res === '-reset'){
			if (data.gConfig.prefix === config.prefix) {
				return messageOrEmbed(client, `Custom prefix were not set in **${message.guild.name}**`, message);
			} else {
				data.gConfig.prefix = config.prefix;
				await this.updateGuildDataCache(client, message.guild.id, data);
				return messageOrEmbed(client, 'Prefix have been reset to `*`', message);
			}
		}

		if(res.length > 5 || res == '-reset') {
			return messageOrEmbed(client, ' Your new prefix must be under `5` characters!', message);
		}

		data.gConfig.prefix = setPrefix;
		await this.updateGuildDataCache(client, message.guild.id, data);
		return  messageOrEmbed(client, `The prefix for ${message.channel.guild.name} is set to \`${res}\``, message);
    }
}