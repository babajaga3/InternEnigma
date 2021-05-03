const BaseCommand = require('../../utils/structures/BaseCommand.js');
const emoji = require('../../utils/config/emojis.json');
const { messageOrEmbed } = require("../../utils/models/converter.js");

module.exports = class CommandToggleCommand extends BaseCommand {
    constructor() {
        super({
            name: "commandtoggle",
            category: "Settings",
            description: "Disables/Enables commands",
            aliases: ['cmdtoggle', 'togglecmd', 'togglecommand', 'tcmd', 'cmdt'],
            usage: "<command>",
            permissions: ['ADMINISTRATOR']
        })
    }

    async run(client, message, args) {
        if (!args[0]) return messageOrEmbed(client, "Please provide a command", message);

        const data = await this.getGuildDataDB(message.guild.id);
		const CacheData = client.guildSettings.get(message.guild.id);

        const command = client.commands.get(args[0]);
        if(!command) return messageOrEmbed(client, "Invalid command provided", message);

        if(command.name === "help") return messageOrEmbed(client, "The help command cannot be disabled", message);

        if(!CacheData?.blacklistCommand.includes(command.name)) {
			data.gConfig.blacklistCommand.push(command.name);
			await this.updateGuildDataCache(client, message.channel.guild.id, data); ;
            return messageOrEmbed(client, `${emoji.turnedoff.emoji} Command  \`${command.name}\` has been disabled`, message);
        } else {
			const channelIndex = data.gConfig.blacklistCommand.indexOf(command.name);
			let newblacklistCommand = data.gConfig.blacklistCommand;
			newblacklistCommand.splice(channelIndex, 1);
            
			data.gConfig.blacklistCommand = newblacklistCommand;
			await this.updateGuildDataCache(client, message.channel.guild.id, data);
			return messageOrEmbed(client, `${emoji.turnedoff.emoji} Command:  \`${command.name}\` has been enabled.`, message);
        }

    }
}