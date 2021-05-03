const BaseCommand = require("../../utils/structures/BaseCommand.js");
const { MessageEmbed, MessageAttachment } = require("discord.js");
const emoji = require("../../utils/config/emojis.json");
const config = require("../../utils/config/config.json");
const { messageOrEmbed, genId } = require("../../utils/models/converter.js");
const fetch = require("node-fetch");
require("dotenv").config();
const guildSettings = require('../../models/guildSettings')
const tagDB = require('../../models/tagSchema');

module.exports = class EvalCommand extends BaseCommand {
    constructor() {
        super({
            name: "data",
            description: "Utility for getting docs from the DJS docs",
            category: "Owner",
            description: "Some testing",
            owner: true,
        });
    }

    async run(client, message, args) {
        const data = await this.getGuildDataDB(message.guild.id)
        const cacheData = await this.getGuildCacheData(client, message.guild.id)

        if(args[0] === "reset"){
            await guildSettings.findOneAndDelete({guildID: message.guild.id})
            await  tagDB.deleteMany({guild: message.guild.id,});
            await this.updateGuildDataCache(client, message.guild.id)
            return message.channel.send("done")
        }


        console.log(data.gConfig)
        console.log("Cache data below")
        console.log(cacheData)
    }
}