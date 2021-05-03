const BaseCommand = require('../../utils/structures/BaseCommand');
const color = require('../../utils/config/colors.json');
const {
    MessageEmbed
} = require('discord.js');
const { messageOrEmbed } = require('../../utils/models/converter');

module.exports = class EmojiCommand extends BaseCommand {
    constructor() {
        super({
            name: "emoji",
            description: "Add any emoji from any guild you are in via mention or ID",
            usage: "<emoji | emoji id>",
            category: "Utilities",
            aliases: ['emojiadd', 'addemoji', 'emj', 'ae'],
            permissions: ['MANAGE_EMOJIS'],
            cooldown: 5
        });
    }

    async run(client, message, args) {
        if (!args[0]) return messageOrEmbed(client, "Please provide a valid emoji", message)
        const regex = args[0].replace(/^<a?:\w+:(\d+)>$/, '$1')
        const regexname = args[0].replace(/^<a?:(\w+):(\d+)>$/, '$1')
        const emojiname = args[1]
        const url = `https://cdn.discordapp.com/emojis/${regex}`

        if (emojiname && emojiname.length > 32) {
            return messageOrEmbed(client, "New emoji name cannot be longer than `32` characters", message);
        } else if (emojiname && emojiname.length < 2) {
            return messageOrEmbed(client, "New emoji name cannot be shorter than `2` characters", message);
        }

        message.guild.emojis.create(url, !emojiname ? regexname : emojiname, {
            reason: `Emoji added by ${message.member.user.tag} - ${message.member.user.id}`
        }).then(() => {
            const embed = new MessageEmbed()
                .setTitle("Emoji Created")
                .setDescription(`Successfully added emoji with name: \`${!emojiname ? regexname : emojiname}\``)
                .setColor(color.red || message.member.displayHexColor || 'RANDOM')
                .setThumbnail(url);
            message.channel.send(embed)
        }).catch(err => {
            messageOrEmbed(client, "An error occured, most likely you are out of emoji slots or you provided an invalid emoji!", message)
            console.error(err)
            return;
        })
    }
}