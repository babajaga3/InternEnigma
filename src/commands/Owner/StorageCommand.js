const BaseCommand = require("../../utils/structures/BaseCommand.js");
const { MessageEmbed, MessageAttachment } = require("discord.js");
const emoji = require("../../utils/config/emojis.json");
const config = require("../../utils/config/config.json");
const ACCEPT = emoji.check.id;
const REJECT = emoji.cross.id;
const {
    messageOrEmbed,
    genId
} = require("../../utils/models/converter.js");
require("dotenv").config();

module.exports = class StorageCommand extends BaseCommand {
    constructor() {
        super({
            name: "store",
            description: "Utility for storing small files like documents or txt files up to 10MB",
            category: "Owner",
            aliases: ['st', 'ma', 'storage'],
            owner: true,
        });
    }

    async run(client, message, args) {
        const guild = client.guilds.cache.get(process.env.STORAGE_GUILD);
        const channel = guild.channels.cache.get(process.env.STORAGE_CHANNEL);
        if (!args.length && !message.attachments.first()) return messageOrEmbed(client, "Please either provide a file you would like to be stored **or** give a valid id for a file you have already stored", message);

        if (message.attachments.first()) {
            this.uploadFile(message, channel, 10);
        }

        if (args[0]) {
            const subcmd = args[0];
            switch (subcmd) {
                case "delete":
                    this.deleteFile(message, channel, args);
                    break;
                default:
                    this.fetchFile(message, channel, args);
                    break;
            }
        }
    }

    async uploadFile(message, channel, size) {
        if ([null, undefined].includes(message.attachments.first())) return messageOrEmbed(client, "Please provide a valid attachment", message);
        const entry = message.attachments.first();
        const att = new MessageAttachment(entry.url);
        const entryID = genId(10);
        if (entry.size > size * 1000 * 1000) return messageOrEmbed(client, "File cannot be bigger than 10MB. This is a temporary storage meant for documents and small files", message);
        var mes = await message.channel.send("Uploading...")
        try {
            var msg = await channel.send(entryID, att);
            msg.edit(message.member.id)
            mes.edit("File has been stored\nID: `" + msg.id + "`");
            return;
        } catch (err) {
            mes.edit("Failed to upload");
            return;
        }
    }

    fetchFile(message, channel, args) {
        const attID = args[0];
        const msgEntry = channel.messages.fetch(attID)
            .then((msg) => {
                if ([null, undefined].includes(msg)) return messageOrEmbed(client, "Please provide a valid ID", message);
                if (msg.content.toString() === message.member.id.toString() || msg.content.toString() === config.botownerID.toString()) {
                    const embed = new MessageEmbed()
                        .setDescription(`Here is your [\`file\`](${msg.attachments.first().url})`)
                        .setColor('RANDOM');
                    message.member.send(embed)
                    messageOrEmbed(client, "Check your DMs", message);
                } else {
                    return messageOrEmbed(client, "You are not the owner of this file", message);
                }

            })
            .catch(err => {
                return messageOrEmbed(client, "Please provide a valid ID", message);
            });
        return;
    }

    async deleteFile(message, channel, args) {
        const attID = args[1];
        const msgEntry = channel.messages.fetch(attID)
            .then(async (msg) => {
                if (msg.content.toString() === message.member.id || msg.content.toString() === config.botownerID) {
                    const choiceMessage = await message.channel.send("Are you sure you want to delete your file ?");
                    choiceMessage.react(ACCEPT);
                    choiceMessage.react(REJECT);
                    const filter = (reaction, user) => [ACCEPT, REJECT].includes(reaction.emoji.id) && user.id === message.member.id;
                    const reactions = await choiceMessage.awaitReactions(filter, {
                        max: 1,
                        time: 60 * 1000,
                    });

                    const choice = reactions.get(ACCEPT) || reactions.get(REJECT);

                    if (choice.emoji.id === ACCEPT) {
                        choiceMessage.reactions.removeAll();
                        msg.delete();
                        choiceMessage.edit("Deleted the file");
                    } else if (choice.emoji.id === REJECT) {
                        choiceMessage.reactions.removeAll();
                        choiceMessage.edit("Okay, going to keep it");
                    }
                } else {
                    return messageOrEmbed(client, "You are not the owner of this file", message);
                }
            })
            .catch((err) => {
                console.log("error lmao");
                messageOrEmbed(client, "Please provide a valid ID", message);
            });
    }

}