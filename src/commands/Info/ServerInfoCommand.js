const BaseCommand = require('../../utils/structures/BaseCommand');
const config = require('../../utils/config/config.json');
const emoji = require('../../utils/config/emojis.json');
const {
    YesOrNo,
    Seconds
} = require('../../utils/models/converter.js');
const {
    formatTime
} = require('../../utils/functions/formatTime.js');
const {
    MessageEmbed
} = require('discord.js');

module.exports = class ServerInfoCommand extends BaseCommand {
    constructor() {
        super({
            name: 'serverinfo',
            category: 'Info',
            description: 'Shows info about the server',
            aliases: ['serveri', 'infoserver', 'si'],
            permissions: ["MANAGE_MESSAGES"],
            cooldown: 3
        });
    }

    async run(client, message, args) {
        const {
            guild
        } = message
        const creationDate = guild.createdAt.toString().slice(0, 15)
        const embed = new MessageEmbed()
            .setThumbnail(guild.iconURL({
                "dynamic": true,
                "size": 512
            }))
            .setColor('RANDOM')
            .setTitle(guild.name)
            .setDescription(`**Server ID** - \`${guild.id}\`\n**Server created at** - \`${creationDate}\``)
            .setFooter(`React for more info`)
            .addFields({
                name: 'Owner',
                value: "`" + guild.owner.user.tag + "`",
                inline: true
            }, {
                name: 'Region',
                value: "`" + guild.region.replace("-", " ").split(" ")
                    .map(w => w[0].toUpperCase() + w.substr(1).toLowerCase())
                    .join(' ') + "`",
                inline: true
            }, {
                name: "Member Count",
                value: "`" + guild.memberCount + "`",
                inline: true
            }, {
                name: "AFK Channel",
                value: guild.afkChannel == null ? "`None`" : "`" + guild.afkChannel.name + "`",
                inline: true
            }, {
                name: "Channels",
                value: "`" + guild.channels.cache.size + "`",
                inline: true
            })


        await message.channel.send(embed)
            .then((msg) => {
                msg.react(emoji.newsemoji.id)
                const filter = (reaction, user) => reaction.emoji.id.toString() === emoji.newsemoji.id && user.id === message.member.id;
                const collector = msg.createReactionCollector(filter, {
                    time: Seconds(60),
                    max: 1
                });
                collector.on('collect', async() => {
                    console.log("Collected a reaction from server info command")
                    const afkTime = await formatTime(guild.afkTimeout)
                    const moreinfoembed = new MessageEmbed()
                        .setColor('RANDOM')
                        .setThumbnail(guild.iconURL({
                            "dynamic": true,
                            "size": 512
                        }))
                        .setImage(guild.bannerURL({
                            "dynamic": true,
                            "size": 512
                        }))
                        .setDescription(`
                **Server Name** - \`${guild.name}\`
                **Server Description** - \`${guild.description ? guild.description : "None"}\`
                **Server ID** - \`${guild.id}\`
                **Server created at** - \`${creationDate}\`
                **Server Owner** - \`${guild.owner.user.tag}\`
                **Server Owner ID** - \`${guild.ownerID}\`
                `)
                        .addFields({
                            name: 'Region',
                            value: "`" + guild.region.replace("-", " ").split(" ")
                                .map(w => w[0].toUpperCase() + w.substr(1).toLowerCase())
                                .join(' ') + "`",
                            inline: true
                        }, {
                            name: "Member Count",
                            value: "`" + guild.memberCount + "`",
                            inline: true
                        }, {
                            name: "AFK Channel",
                            value: guild.afkChannel == null ? "`Channel is not set`" : "`" + guild.afkChannel.name + "`",
                            inline: true
                        }, {
                            name: "AFK Timeout",
                            value: guild.afkTimeout ? "`" + afkTime + "`" : "`None`",
                            inline: true
                        }, {
                            name: "Channels",
                            value: "`" + guild.channels.cache.size + "`",
                            inline: true
                        }, {
                            name: "Boosts",
                            value: "`" + guild.premiumSubscriptionCount + "`",
                            inline: true
                        }, {
                            name: "Server Boost Level",
                            value: "`" + guild.premiumTier + "`",
                            inline: true
                        }, {
                            name: "Partnered Server",
                            value: "`" + YesOrNo(guild.partnered) + "`",
                            inline: true
                        }, {
                            name: "Verified Server",
                            value: "`" + YesOrNo(guild.verified) + "`",
                            inline: true
                        }, {
                            name: "Vanity URL",
                            value: !guild.vanityURLCode ? "`None`" : "`" + guild.vanityURLCode + "`",
                            inline: true
                        }, {
                            name: "Roles",
                            value: "`" + guild.roles.cache.size + "`",
                            inline: true
                        })

                    try {
                        msg.edit(moreinfoembed)
                    } catch (err) {
                        console.log(err)
                    }
                })

            });
    }
}