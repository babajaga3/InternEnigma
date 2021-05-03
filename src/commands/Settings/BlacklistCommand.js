const BaseCommand = require('../../utils/structures/BaseCommand.js');
const emojis = require('../../utils/config/emojis.json');
const { Member, messageOrEmbed, Channel } = require('../../utils/models/converter.js');
const config = require('../../utils/config/config.json');

module.exports = class BlacklistCommand extends BaseCommand {
    constructor() {
        super({
            name: 'blacklist',
            description: "Blacklists users or channel",
            category: "Settings",
            aliases: ['blist', 'bl', 'blackl', ],
            usage: "<member>",
            permissions: ['ADMINISTRATOR']
        });
    }

    async run(client, message, args) {
        const User = Member(message, args.join(' '));
		const channel = Channel(message, args.join(' '));
        const data = await this.getGuildDataDB(message.guild.id);
		const CacheData = await this.getGuildCacheData(client, message.guild.id);

		if(User) {
			if(User.permissions.has('ADMINISTRATOR'))
				return messageOrEmbed(client, 'You can\'t blacklist an Administrator.', message);
			if(User.id === config.botownerID)
				return messageOrEmbed(client,  'You can\'t blacklist the bot owner, NOOB!!', message);
			if(User.id === message.author.id)
				return messageOrEmbed(client,  'You can\'t blacklist yourself.', message);    
			if(User.id === client.user.id)
				return messageOrEmbed(client,  'Why are you blacklisting me???', message);
			if(User.manageable === false)
				return messageOrEmbed(client,  'Denied: Equal permissions or higher role.', message);

			if(data.gConfig.blacklistUser.includes(User.id)) {
				return messageOrEmbed(client, `<@${User.id}> is already blacklisted.`, message);
			}
		
			data.gConfig.blacklistUser.push(User.id);
			await this.updateGuildDataCache(client, message.channel.guild.id, data);
			return messageOrEmbed(client, `I have added <@${User.id}> to the blacklist.`, message);	
			 
		}

		if(channel) {
			if(channel.type !== "text" || !channel.viewable) {
				return messageOrEmbed(client, 'Please provide a valid text channel to blacklist.', message);
			}

			if(data.gConfig.blacklistChannel.includes(channel.id)) {
				return messageOrEmbed(client, `<#${channel.id}> is already part of the blacklist.`, message);
			}
	
			data.gConfig.blacklistChannel.push(channel.id);
			await this.updateGuildDataCache(client, message.channel.guild.id, data);
			return messageOrEmbed(client, `I have added <#${channel.id}> to the blacklist.`, message);
		}

		if(!User && !channel) {
			return messageOrEmbed(client,  `I couldn't find ${args.join(' ')}`, message);
		}
    }
}