const BaseCommand = require("../../utils/structures/BaseCommand.js");
const emoji = require("../../utils/config/emojis.json");
const roles = require('../../utils/config/convert.json');
const {
    messageOrEmbed,
    Role,
    Seconds,
    YesOrNo,
} = require("../../utils/models/converter.js");
const {
    MessageEmbed
} = require("discord.js");


module.exports = class RoleInfoCommand extends BaseCommand {
    constructor() {
        super({
            name: "roleinfo",
            category: "Info",
            aliases: ['ri', 'rolei', 'rinfo'],
            permissions: ['MANAGE_MESSAGES'],
            usage: "<role>",
            description: "Shows info about a role",
            cooldown: 3
        });
    }

    async run(client, message, args) {
        const role = Role(message, args);
        if ([null, undefined].includes(role)) return messageOrEmbed(client, "Please provide a valid role", message);

        const embed = new MessageEmbed()
            .setTitle("Role Info")
            .setColor(role.hexColor || 'RANDOM')
            .setFooter("React for more info")
            .setThumbnail(message.guild.iconURL({
                "dynamic": true,
                "size": 512
            }))
            .setDescription(`
            **Name** - \`${role.name}\`
            **ID** - \`${role.id}\`
            **Color** - \`${role.hexColor}\`
            **Created At** - \`${role.createdAt.toString().slice(0, 15)}\`
            `);
        await message.channel.send(embed)
            .then((msg) => {
                msg.react(emoji.newsemoji.id);
                const filter = (reaction, user) => reaction.emoji.id.toString() === emoji.newsemoji.id && user.id === message.member.id;
                const collector = msg.createReactionCollector(filter, {
                    time: Seconds(60),
                    max: 1
                });
                collector.on('collect', () => {
                    const newEmbed = new MessageEmbed()
                        .setTitle("Role Info")
                        .setColor(role.hexColor || 'RANDOM')
                        .setThumbnail(message.guild.iconURL({
                            "dynamic": true,
                            "size": 512
                        }))
                        .setDescription(`
                    **Name** - \`${role.name}\`
                    **ID** - \`${role.id}\`
                    **Color** - \`${role.hexColor}\`
                    **Created At** - \`${role.createdAt.toString().slice(0, 15)}\`
                    `)
                        .addFields({
                            name: "Managed by an external service",
                            value: "`" + YesOrNo(role.managed) + "`",
                            inline: true
                        }, {
                            name: "Editable",
                            value: "`" + YesOrNo(role.editable) + "`",
                            inline: true
                        }, {
                            name: "Mentionable",
                            value: "`" + YesOrNo(role.mentionable) + "`",
                            inline: true
                        }, {
                            name: "Deleted",
                            value: "`" + YesOrNo(role.deleted) + "`",
                            inline: true
                        }, {
                            name: "Displayed separately",
                            value: "`" + YesOrNo(role.hoist) + "`",
                            inline: true
                        }, {
                            name: "Position",
                            value: "`" + role.position + "`",
                            inline: true
                        }, {
                            name: "Hex Color",
                            value: "`" + role.hexColor + "`",
                            inline: true
                        }, {
                            name: "Permissions",
                            value: "`" + role.permissions.length ? role.permissions
                                .toArray()
                                .map(role => roles.permissions[role]) : 'None' + "`"
                        });
                    msg.edit(newEmbed)
                })
            })
    }
}