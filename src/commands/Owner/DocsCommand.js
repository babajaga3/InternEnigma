const BaseCommand = require("../../utils/structures/BaseCommand.js");
const { MessageEmbed, MessageAttachment } = require("discord.js");
const emoji = require("../../utils/config/emojis.json");
const config = require("../../utils/config/config.json");
const { messageOrEmbed, genId } = require("../../utils/models/converter.js");
const fetch = require("node-fetch");
require("dotenv").config();

module.exports = class EvalCommand extends BaseCommand {
    constructor() {
        super({
            name: "docs",
            description: "Utility for getting docs from the DJS docs",
            category: "Owner",
            description: "Some testing",
            owner: true,
        });
    }

    async run(client, message, args) {
        if (!args.length || !args[0]) return messageOrEmbed(client, "Please provide the necessary arguments", message);
        const project = "stable";
        if (!["stable", "master", "rpc", "commando", "akairo", "akairo-master"].includes(project)) return messageOrEmbed(client, "Please provide a valid project", message);
        const query = args[0];
        const url = `https://djsdocs.sorta.moe/v2/embed?src=${project}&q=${query}`;
        const docFetch = await fetch(url);
        const embed = await docFetch.json();

        if (!embed || embed.error) return messageOrEmbed(client, "Could not find that", message);

        if (!message.guild) return message.channel.send({ embed });
        const msg = await message.channel.send({ embed });
    }
}