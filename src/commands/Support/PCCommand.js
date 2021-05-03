const BaseCommand = require('../../utils/structures/BaseCommand');
const color = require('../../utils/config/colors.json');
const { Member } = require('../../utils/models/converter');
const {
    MessageEmbed, MessageAttachment
} = require('discord.js');
const { messageOrEmbed } = require('../../utils/models/converter');

module.exports = class PCCommand extends BaseCommand {
    constructor() {
        super({
            name: "pc",
            category: "Support",
            description: "A brief message showing the PC LFGs",
            cooldown: 2,
            aliases: ['pclfg', 'lfgpc'],
            usage: "[user]",
        });
    }

    async run(client, message, args) {
        let data = await this.getGuildDataDB(message.guild.id);
        let { PCMessage } = await this.getGuildCacheData(client, message.guild.id);
        let User = Member(message, args[0]);

        if (['update', 'change', 'add', 'set'].includes(args[0]) && message.member.permissions.has(['ADMINISTRATOR'])) {
            let newMessage = args.slice(1).join(" ");
            if ((!newMessage) || (newMessage === PCMessage) || (newMessage.length > 2000)) return messageOrEmbed(client, "Please provide a valid PC message", message);
            data.gConfig.PCMessage = eval("`" + newMessage + "`");
            await this.updateGuildDataCache(client, message.guild.id, data);
            return messageOrEmbed(client, "The message has been updated" ,message)
        }

        if (!PCMessage) {
            return messageOrEmbed(client, "There isn't a message set", message);
        }

        if (message.member.permissions.has(['KICK_MEMBERS'])) {
            if (!User) {
                return message.channel.send(this.clean(client, PCMessage));
            } else { 
                return message.channel.send(`<@!${User.id}>, ` + this.clean(client, PCMessage));
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