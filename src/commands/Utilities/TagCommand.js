const BaseCommand = require('../../utils/structures/BaseCommand');
const { messageOrEmbed } = require("../../utils/models/converter.js");
const { MessageEmbed } = require('discord.js');
const tagDB = require('../../models/tagSchema');
const { update } = require('../../models/tagSchema');

module.exports = class TagCommand extends BaseCommand {
        constructor() {
            super({
                name: "tag",
                description: "Make tags",
                usage: "<tag name>",
                category: "Utilities",
                subcommands: ['add', 'remove', 'edit', 'info'],
                cooldown: 2
            });
        }

        async run(client, message, args) {
            if ((!args[0]) && (args[0] !== "add" || args[0] !== "remove" || args[0] !== "edit" || args[0] !== "info")) return messageOrEmbed(client, "Please provide a tag name", message);
            const tagName = args[0].toLowerCase();


            if (tagName === "add") {
                if (!args[1]) {
                    return messageOrEmbed(client, "Please provide a valid tag name", message);
                } else if (args[1] === "add" || args[1] === "remove" || args[1] === "info" || args[1] === "edit") {
                    return messageOrEmbed(client, "Name of tag cannot be `add`, `remove`, `edit`, `info`", message);
                }
                const newTagName = args[1].toLowerCase();
                const tagContent = args.slice(2).join(" ");

                if (newTagName.length > 100) return messageOrEmbed(client, "Tag name must not exceed `100` characters", message);
                if (tagContent.length > 1500) return messageOrEmbed(client, "Maximum amount of tag content characters is `1500`", message);
                if (!tagContent) return messageOrEmbed(client, "Please provide the tag content", message);

                const tagData = await tagDB.findOne({guild: message.guild.id, tag: newTagName});

                if(tagData) return messageOrEmbed(client, "Тag already exists", message);

                if(!tagData) {
                    let newtagDB = new tagDB({
                        guild: message.guild.id,
                        tag: newTagName,
                        content: tagContent,
                        author: message.member.id,
                        uses: 0
                    })
                    newtagDB.save();
                }

                return messageOrEmbed(client, "Tag created", message);
            }

            if (tagName === "remove") {
                const tag = await tagDB.findOne({guild: message.guild.id, tag: args[1]});
                if(!args[1] || !tag) return messageOrEmbed(client, "Please provide a valid tag name", message);
            
                if(tag.author !== message.member.id) return messageOrEmbed(client, "You are not the owner of this tag", message);

                await tagDB.findOneAndDelete({guild: message.guild.id, tag: args[1]});

                return messageOrEmbed(client, "Tag deleted", message);
            }

            if (tagName === "edit") {
                const editTagName = args[1].toLowerCase();
                const updatedContent = args.slice(2).join(" ");
                const tag = await tagDB.findOne({guild: message.guild.id, tag: editTagName});

                if (!args[1] || !tag) return messageOrEmbed(client, "Please provide a valid tag name", message)
                if (!updatedContent) return messageOrEmbed(client, "Please provide the updated content", message);
                if (tag.author !== message.member.id) return messageOrEmbed(client, "You are not the owner of this tag", message);                    
                if(tag.content === updatedContent) return messageOrEmbed(client, "Please provide an updated content", message)
                if (updatedContent.length > 1500) return messageOrEmbed(client, "The updated content cannot be more than `1500` characters", message);

                tag.content = updatedContent;
                tag.save();
                return messageOrEmbed(client, "Tag updated", message)
            }

            if (tagName === "info") {
                const tag = await tagDB.findOne({guild: message.guild.id, tag: args[1]});
                if (!args[1] || !tag) return messageOrEmbed(client, "Please provide a valid tag name", message);
                const owner = message.guild.members.cache.get(tag.author);
                const embed = new MessageEmbed()
                    .setColor(message.member.displayHexColor || 'RANDOM')
                    .setAuthor(tag.tag, owner.user.avatarURL({ "dynamic": true, "size": 512 }))
                    .setDescription(`**Content:** \n${tag.content}`)
                embed.addFields({
                    name: "Created On",
                    value: "`" + tag.createdAt + "`",
                    inline: true
                }, {
                    name: "Owner",
                    value: "`" + owner.user.tag + "`",
                    inline: true
                }, {
                    name: "Uses",
                    value: "`" + tag.uses + "`",
                    inline: true
                });
                return message.channel.send(embed);
            }

        const tag = await tagDB.findOne({guild: message.guild.id, tag: tagName});
        messageOrEmbed(client, tag ? tag.content : "Tag doesn't exist", message)
        if(tag) {
            tag.uses = tag.uses + 1
            tag.save();
        }
    }
}