const BaseCommand = require('../../utils/structures/BaseCommand.js');
const emojis = require('../../utils/config/emojis.json');
const { MessageEmbed } = require('discord.js');
const { YesOrNo, messageOrEmbed } = require('../../utils/models/converter.js');

module.exports = class EmojiCommand extends BaseCommand {
    constructor() {
        super({
            name: "emojiinfo",
            description: "Get info about an emoji in the server",
            usage: "<emoji>",
            permissions: ['MANAGE_MESSAGES'],
            category: "Info",
            aliases: ['ei', 'ie'],
            cooldown: 3
        })
    }

    async run(client, message, args) {
        if (!args[0]) return messageOrEmbed(client, "Please provide a valid emoji", message);
        const regex = args[0].replace(/^<a?:\w+:(\d+)>$/, '$1');
        const regexname = args[0].replace(/^<a?:(\w+):(\d+)>$/, '$1');
        const emoji = message.guild.emojis.cache.find(emj => emj.name === args[0] || emj.id === regex);
        if(!emoji) return messageOrEmbed(client, "Please provide a valid emoji", message);

        const embed = new MessageEmbed()
            .setTitle(`${emoji.name} Information`)
            .setColor(message.member.displayHexColor || 'RANDOM')
            .setThumbnail(emoji.url)
            .addFields({
                name: "Name",
                value: "`" + emoji.name + "`",
                inline: true
            }, {
                name: "ID",
                value: "`" + emoji.id + "`",
                inline: true
            }, {
                name: "Identifier",
                value: "`" + emoji.identifier + "`"
            }, {
                name: "Animated",
                value: "`" + YesOrNo(emoji.animated) + "`",
                inline: true
            }, {
                name: "Created At",
                value: "`" + emoji.createdAt.toString().slice(0, 15) + "`",
                inline: true
            }, {
                name: "URL",
                value: `[\`Click Here\`](${emoji.url})`,
                inline: true
            });

        message.channel.send(embed);
    }
}