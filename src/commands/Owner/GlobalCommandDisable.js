const BaseCommand = require('../../utils/structures/BaseCommand.js');
const emoji = require('../../utils/config/emojis.json');
const { messageOrEmbed } = require("../../utils/models/converter.js");
require('dotenv').config()

module.exports = class GlobalCommandToggle extends BaseCommand {
    constructor() {
        super({
            name: 'globaltogglecommand',
            category: "Owner",
            aliases: ['gtc', 'gct', 'globalcmdt'],
            description: "Disables/Enables a command for all servers that the bot is in",
            owner: true
        })
    }

    async run(client, message, args) {
        if (!args[0]) return mmessageOrEmbed(client, "Please provide a command", message);
        const command = client.commands.get(args[0]);
        const data = await this.getGuildDataDB(message.guild.id);
		const CacheData = client.guildSettings.get(message.guild.id);

        if(!command) return messageOrEmbed(client, "Invalid command provided", message);
    
        if (command === undefined || command === null) return messageOrEmbed(client, "Invalid command provided", message);
        if (command.name === "help") return messageOrEmbed(client, "The help command cannot be disabled", message);
        if (command.category === "Owner") return messageOrEmbed(client, "Owner commands cannot be disabled", message);

        if(command.name === "help") return messageOrEmbed(client, "The help command cannot be disabled", message);

        if(!CacheData?.globalDisabledCommand.includes(command.name)) {
			data.gConfig.globalDisabledCommand.push(command.name);
			await this.updateGuildDataCache(client, message.channel.guild.id, data); ;
            return messageOrEmbed(client, `${emoji.turnedoff.emoji} Command  \`${command.name}\` has been enabled`, message);
        } else {
			const channelIndex = data.gConfig.globalDisabledCommand.indexOf(command.name);
			let newGlobalDisabledCommand = data.gConfig.globalDisabledCommand;
			newGlobalDisabledCommand.splice(channelIndex, 1);
            
			data.gConfig.globalDisabledCommand = newGlobalDisabledCommand;
			await this.updateGuildDataCache(client, message.channel.guild.id, data);
			return messageOrEmbed(client, `\`${command.name}\` has been disabled.`, message);
        }
    }
}