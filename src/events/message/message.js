const BaseEvent = require('../../utils/structures/BaseEvent');
const BaseCommand = require('../../utils/structures/BaseCommand');
const config = require('../../utils/config/config.json');
const emoji = require('../../utils/config/emojis.json');
const color = require('../../utils/config/colors.json');
const {
    messageOrEmbed
} = require("../../utils/models/converter.js");
const cooldowns = new Map();
const {
    MessageEmbed,
    Collection
} = require('discord.js');

module.exports = class MessageEvent extends BaseEvent {
    constructor() {
        super({
            name: 'message'
        });
    }

    async run(client, message) {
        
            let data = await this.getGuildCacheData(client, message.guild.id);
            let prefix = data ? data?.prefix : config.prefix;

            if (message.author.bot) return;
            if (message.channel.type === "dm") return;
            if (message.content.startsWith(prefix)) {
                const [cmdName, ...cmdArgs] = message.content.slice(prefix.length).trim().split(/\s+/);
                const command = client.commands.get(cmdName);
                if (command) {
                    if (!cooldowns.has(command.name)) {
                        cooldowns.set(command.name, new Collection());
                    }

                    const current_time = Date.now();
                    const timestamps = cooldowns.get(command.name);
                    const cooldown_amount = (command.cooldown) * 1000;

                    if (timestamps.has(message.author.id)) {
                        const expiration_time = timestamps.get(message.author.id) + cooldown_amount;

                        if (current_time < expiration_time) {
                            const time_left = (expiration_time - current_time) / 1000;

                            const embed = new MessageEmbed()
                                .setTitle("Command on cooldown")
                                .setColor(color.red)
                                .setDescription(`This command is currently on cooldown, you may use it again in \`${time_left.toFixed(1)}\` seconds`);
                            return message.reply(embed);
                        }
                    }

                    if (command.owner && message.member.id !== config.botownerID) return messageOrEmbed(client, `${emoji.derp.emoji} This command doesn't exist, so there isn't really any reason to try to use this thing that you just used`, message);
                    if (data.NodmUser.includes(`${message.member.id}`)) {
                        if (data.blacklistUser.includes(message.author.id) && message.member.id !== config.botownerID) return;
                    } else {
                        if (data.blacklistUser.includes(message.author.id)) return message.member.send(new MessageEmbed().setDescription(`You have been blacklisted from using the bot in \`${message.guild.name}\``).setColor(color.red || 'RANDOM').setFooter("If you wish to disable notifications run: '<prefix> settings disable notifications' in any server the bot is in")).catch((err) => console.log(err));
                    }

                    if (!message.member.permissions.has("ADMINISTRATOR")) {
                        if (data.blacklistChannel.includes(message.channel.id)) return;
                    }

                    if (message.member.permissions.has(command.permissions) || message.member.id === config.botownerID) {
                        if (data.blacklistCommand.includes(command.name) && message.member.id !== config.botownerID && !message.member.permissions.has("ADMINISTRATOR")) {
                            const embed = new MessageEmbed()
                                .setTitle("Command Disabled")
                                .setColor(color.red || 'RANDOM')
                                .setDescription(`\`${command.name}\` is disabled`);
                            message.channel.send(embed);
                            return;
                        }

                        if (data.globalDisabledCommand.includes(command.name)) {
                            const embed = new MessageEmbed()
                                .setTitle("Command is globally disabled")
                                .setDescription(`This command \`(${command.name})\` has been disabled for all servers, most likely due to a bug`)
                                .setColor(color.red || 'RANDOM');
                            message.channel.send(embed);
                            return;
                        }

                        command.run(client, message, cmdArgs);
                        if (message.member.id !== config.botownerID) {
                            timestamps.set(message.member.id, current_time);
                        }
                        setTimeout(() => {
                            timestamps.delete(message.author.id)
                        }, cooldown_amount);
                    } else {
                        const embed = new MessageEmbed()
                            .setTitle("Invalid Permissions")
                            .setDescription(`You do not have enough permissions to use this command\n\n**Required Permissions: **\`${command.permissions.toString().replace("_", " ").split(" ")
                        .map(w => w[0].toUpperCase() + w.substr(1).toLowerCase())
                        .join(' ')}\``)
                            .setColor(color.red);
                        message.reply(embed)
                    }
                }
            }
        
    } catch (err) {
        message.channel.send("An error occurred lol");
    }
}