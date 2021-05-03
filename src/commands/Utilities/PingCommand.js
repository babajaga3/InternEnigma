const BaseCommand = require('../../utils/structures/BaseCommand');
const color = require('../../utils/config/colors.json');
const { MessageEmbed } = require('discord.js');
const { messageOrEmbed } = require('../../utils/models/converter');

module.exports = class EmojiCommand extends BaseCommand {
    constructor() {
        super({
            name: "ping",
            description: "The latency of the bot",
            category: "Utilities",
            cooldown: 5
        });
    }

    async run(client, message, args) {
        let start = Date.now()
        return message.channel.send('Pinging ...').then(m => { m.edit(`Pong \`${Date.now() - start} ms\``)});
    }
}