const BaseCommand = require('../../utils/structures/BaseCommand.js');
const emojis = require('../../utils/config/emojis.json');
const { Member, messageOrEmbed, Channel } = require('../../utils/models/converter.js');

module.exports = class WhitelistCommand extends BaseCommand {
    constructor() {
        super({
            name: "whitelist",
            category: "Settongs",
            description: "Whitelists people for using the bot",
            usage: "<member>",
            permissions: ['ADMINISTRATOR'],
            aliases: ['wlist', 'wl', 'whitel']
        });
    }

    async run(client, message, args) {
        const User = Member(message, args.join(' '));
		const channel = Channel(message, args.join(' '));
        const data = await this.getGuildDataDB(message.guild.id);
		const CacheData = client.guildSettings.get(message.guild.id);

        if(!args[0]) {
            return messageOrEmbed(client, 'Please specify a either `user`|`channel`|`all user`|`all channel` to whitelist.', message)
        }

		if(args[0].toLowerCase() === 'all') {
			const query = args[1];
			if(!query || query.toLowerCase() !== 'channel' && query.toLowerCase() !== 'user') {
				return messageOrEmbed(client,  'Please specify either `channel`|`user`` to whitelist.', message);
			}

			if(query.toLowerCase() === 'channel') {
				if(!CacheData?.blacklistChannel.length) {
					return messageOrEmbed(client,  'No channels were blacklisted.', message);
				}

				data.gConfig.blacklistChannel = [];
				await this.updateGuildDataCache(client, message.channel.guild.id, data);
				return messageOrEmbed(client,  'All channels has been whitelist.', message);
			}

			if(query.toLowerCase() === 'user') {
				if(!CacheData?.gConfig.blacklistUser.length) {
					return messageOrEmbed(client,  'No users were blacklisted.', message);
				}

				data.gConfig.blacklistUser = [];
				await this.updateGuildDataCache(client, message.channel.guild.id, data);
				return messageOrEmbed(client,  'All users has been whitelisted.', message);
			}
		}

		if(User) {
			if(!data.gConfig.blacklistUser.includes(User.id)) {
				return messageOrEmbed(client, `<@${User.id}> is not blacklisted.`, message);
			}
		
			const channelIndex = data.gConfig.blacklistUser.indexOf(User.id);
			let newblacklistUser = data.gConfig.blacklistUser;

			newblacklistUser.splice(channelIndex, 1);

			data.gConfig.blacklistUser = newblacklistUser;
			await this.updateGuildDataCache(client, message.channel.guild.id, data);
			return messageOrEmbed(client,  `I have remove <@${User.id}> from the blacklist.`, message);
		}

		if(channel) {
			if(!data.gConfig.blacklistChannel.includes(channel.id)) {
				return messageOrEmbed(client,  `<#${channel.id}> was not blacklisted.`, message);
			}

			const channelIndex = data.gConfig.blacklistChannel.indexOf(channel.id);
			let newblacklistChannel = data.gConfig.blacklistChannel;
			newblacklistChannel.splice(channelIndex, 1);
			data.gConfig.blacklistChannel = newblacklistChannel;
			await this.updateGuildDataCache(client, message.channel.guild.id, data);
			return messageOrEmbed(client,  `I have remove <#${channel.id}> from the blacklist`, message);
		}

		if(!User && !channel) {
			return messageOrEmbed(client,  `I couldn't find ${args.join(' ')}`, message);
		}
    }
}