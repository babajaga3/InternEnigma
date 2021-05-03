const BaseCommand = require('../../utils/structures/BaseCommand.js');
const emoji = require('../../utils/config/emojis.json');
const { messageOrEmbed } = require("../../utils/models/converter.js");
const { MessageMentions } = require('discord.js');
require('dotenv').config()
const ACCEPT = emoji.check.id;
const REJECT = emoji.cross.id;
const config = require('../../utils/config/config.json');
const { removeElement } = require('../../utils/functions/formatTime');

module.exports = class SettingsCommand extends BaseCommand {
    constructor() {
        super({
            name: "settings",
            description: "Change settings",
            category: "Settings",
            usage: "<subcommand> <option>",
            permissions: ['ADMINISTRATOR'],
            subcommands: ['reset', 'toggle'],
            aliases: ['sttngs', 'preferences']
        });
    }

    async run(client, message, args) {
        if (!args[0]) return messageOrEmbed(client, "Please specify a subcommand", message);
        const subcmd = args[0].toLowerCase();
		const data = await this.getGuildDataDB(message.guild.id);
		const CacheData = client.guildSettings.get(message.guild.id);
		let newPrefix = config.prefix;
		if(CacheData) {
			newPrefix = CacheData?.prefix;
		}

        if (['restore', 'reset'].includes(subcmd)) {
            if (!args[1]) return messageOrEmbed(client, "Please specify a command/option", message);
            const option = args[1].toLowerCase();
            const command = client.commands.get(option);
            const cmdids = command.aliases;
            cmdids.push(command.name);

            if (command.category !== "Settings") return messageOrEmbed(client, "Please specify a valid option either toggle or reset", message);

            if (cmdids.includes(command.name) && command.name === "prefix") {
                if (CacheData?.prefix === config.prefix) return messageOrEmbed(client, "You can't reset the default prefix", message);

                messageOrEmbed(client, "Are you sure you want to reset the server prefix ?", message)
                    .then(async (msg) => {
                        msg.react(ACCEPT);
                        msg.react(REJECT);
                        const filter = (reaction, user) => [ACCEPT, REJECT].includes(reaction.emoji.id) && user.id === message.member.id;
                        const reactions = await msg.awaitReactions(filter, {
                            max: 1,
                            time: 60 * 1000,
                        });

                        const choice = reactions.get(ACCEPT) || reactions.get(REJECT);

                        if (choice.emoji.id === ACCEPT) {
                            data.gConfig.prefix = config.prefix;
				            await this.updateGuildDataCache(client, message.guild.id, data);
                            msg.reactions.removeAll();
                            return msg.edit("The prefix has been reset");
                        } else if (choice.emoji.id === REJECT) {
                            msg.reactions.removeAll();
                            return msg.edit("The prefix was **NOT** reset");
                        }
                    });
            } else {
                return messageOrEmbed(client, "Please specify a valid option", message);
            }

        } else if (['toggle'].includes(subcmd)) {
            const dmOptions = ['notifications', 'dms', 'dm'];
            const embedOptions = ['embed', 'embeds', 'emb', 'e']
            if (!args[1]) return messageOrEmbed(client, "Please specify a valid option", message);
            const option = args[1].toLowerCase();

            if (dmOptions.includes(option)) {
                if (!CacheData?.NodmUser.includes(`${message.member.id}`)) {
                    data.gConfig.NodmUser.push(message.member.id)
                    await this.updateGuildDataCache(client, message.guild.id, data);
                    return messageOrEmbed(client, `${emoji.turnedoff.emoji} DM notifications have been turned off`, message);
                } else {
                    const userIndex = data.gConfig.NodmUser.indexOf(message.member.id);
                    let newDmArray = data.gConfig.NodmUser;
                    newDmArray.splice(userIndex, 1)
                    data.gConfig.NodmUser = newDmArray;
                    await this.updateGuildDataCache(client, message.channel.guild.id, data);
                    return messageOrEmbed(client, `${emoji.turnedoff.emoji} DM notifications have been turned on`, message);
                }
            } else if (embedOptions.includes(option)) {

                if (CacheData?.embedOnOrOff === false) {
                    data.gConfig.embedOnOrOff = true;
                    await this.updateGuildDataCache(client, message.channel.guild.id, data);
                    return messageOrEmbed(client,`${emoji.turnedon.emoji} Embeds have been turned on`, message);
                } else {
                    data.gConfig.embedOnOrOff = false;
                    await this.updateGuildDataCache(client, message.channel.guild.id, data);;
                    return messageOrEmbed(client, `${emoji.turnedoff.emoji} Embeds have been turned off`, message);
                }
            }
        }
    }
}
