const BaseCommand = require('../../utils/structures/BaseCommand');
const color = require('../../utils/config/colors.json');
const { Member } = require('../../utils/models/converter');
const {
    MessageEmbed, MessageAttachment
} = require('discord.js');
const { messageOrEmbed } = require('../../utils/models/converter');

module.exports = class XBCommand extends BaseCommand {
    constructor() {
        super({
            name: "xbox",
            category: "Support",
            description: "A brief message showing the Xbox LFGs",
            cooldown: 2,
            aliases: ['xb', 'lfgxb', 'xblfg'],
            usage: "[user]",
        });
    }

    async run(client, message, args) {
        let data = await this.getGuildDataDB(message.guild.id);
        let { XBMessage } = await this.getGuildCacheData(client, message.guild.id);
        let User = Member(message, args[0]);

        if (['update', 'change', 'add', 'set'].includes(args[0]) && message.member.permissions.has(['ADMINISTRATOR'])) {
            let newMessage = args.slice(1).join(" ");
            if ((!newMessage) || (newMessage === XBMessage) || (newMessage.length > 2000)) return messageOrEmbed(client, "Please provide a valid Xbox message", message);
            data.gConfig.XBMessage = eval("`" + newMessage + "`");
            await this.updateGuildDataCache(client, message.guild.id, data);
            return messageOrEmbed(client, "The message has been updated" ,message)
        } 

        if (!XBMessage) {
            return messageOrEmbed(client, "There isn't a message set", message);
        }

        if (message.member.permissions.has(['KICK_MEMBERS'])) {
            if (!User) {
                return message.channel.send(this.clean(client, XBMessage));
            } else { 
                return message.channel.send(`<@!${User.id}>, ` + this.clean(client, XBMessage));
            }
        }

        
    }

    clean(client, text) {
        if (typeof text === "string") {
            text = text
                .replace(/`/g, `\`${String.fromCharCode(8203)}`)
                .replace(/@/g, `@${String.fromCharCode(8203)}`)
                .replace(new RegExp(client.token, 'gi'), '')
        }
        return text;
    }
}