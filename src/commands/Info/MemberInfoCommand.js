const BaseCommand = require('../../utils/structures/BaseCommand');
const config = require('../../utils/config/config.json');
const emoji = require('../../utils/config/emojis.json');
const { Member, Seconds, Emoji, YesOrNo, messageOrEmbed} = require('../../utils/models/converter.js');
const { formatTime } = require('../../utils/functions/formatTime.js');
const { MessageEmbed } = require('discord.js');

module.exports = class MemberInfoCommand extends BaseCommand {
    constructor() {
        super({
            name: 'memberinfo',
            category: 'Info',
            description: 'Shows info about a member',
            aliases: ['memberi', 'infomember', 'mi'],
            usage: "[member]",
            cooldown: 3,
            permissions: ["MANAGE_MESSAGES"]
        });
    }

    async run(client, message, args) {
        const member = Member(message, args) || message.member;
        const creationDate = member.user.createdAt.toString().slice(0, 15)
        const flags = {
            DISCORD_EMPLOYEE: emoji.discordstaff.emoji,
            PARTNERED_SERVER_OWNER: emoji.discordpartner.emoji,
            DISCORD_PARTNER: emoji.discordpartner.emoji,
            BUGHUNTER_LEVEL_1: emoji.bughunter.emoji,
            BUGHUNTER_LEVEL_2: emoji.bughunter2.emoji,
            HYPESQUAD_EVENTS: 'HypeSquad Events',
            HOUSE_BRAVERY: emoji.hs_bravery.emoji,
            HOUSE_BRILLIANCE: emoji.hs_brilliance.emoji,
            HOUSE_BALANCE: emoji.hs_balance.emoji,
            EARLY_SUPPORTER: 'Early Supporter',
            TEAM_USER: 'Team User',
            SYSTEM: 'System',
            VERIFIED_BOT: 'Verified Bot',
            VERIFIED_DEVELOPER: emoji.botdev.emoji,
            EARLY_VERIFIED_BOT_DEVELOPER: emoji.botdev.emoji

        };
        if (member in message.guild === false && member !== message.member) {
            messageOrEmbed(client, "Member is not in this server", message)
            return;
        }
        const embed = new MessageEmbed()
            .setThumbnail(member.user.avatarURL({
                "dynamic": true,
                "size": 512
            }))
            .setColor(member.displayHexColor || 'RANDOM')
            .setFooter(`React for more info`)
            .setAuthor(member.user.username, member.user.avatarURL({
                "dynamic": true,
                "size": 512
            }), `https://discord.com/users/${member.user.id}`)
            .setDescription(`
            **Name** - \`${member.user.tag}\`
            **ID** - \`${member.user.id}\`
            `)
            .addFields({
                name: "Created",
                value: "`" + creationDate + "`",
                inline: true
            }, {
                name: "Joined",
                value: "`" + member.joinedAt.toString().slice(0, 15) + "`",
                inline: true
            }, {
                name: `Roles (${member.roles.cache.size - 1})`,
                value: member.roles.cache.map(r => `${r}`).slice(0, -1).join(' '),
                inline: false
            })
        message.channel.send(embed)
            .then((msg) => {
                msg.react(emoji.newsemoji.id)
                const filter = (reaction, user) => reaction.emoji.id.toString() === emoji.newsemoji.id && user.id === message.member.id;
                const collector = msg.createReactionCollector(filter, {
                    time: Seconds(60),
                    max: 1
                });
                collector.on('collect', async() => {
                    console.log("Collected a reaction from member info command")
                    const moreinfoembed = new MessageEmbed()
                        .setAuthor(member.user.username, member.user.avatarURL({
                            "dynamic": true,
                            "size": 512
                        }), `https://discord.com/users/${member.user.id}`)
                        .setColor(member.displayHexColor || 'RANDOM')
                        .setThumbnail(member.user.avatarURL({
                            "dynamic": true,
                            "size": 512
                        }))
                        .setDescription(`
                        **Name** - \`${member.user.tag}\`
                        **Server Nickname** - \`${!member.nickname ? "None" : member.nickname}\`
                        **Created On** - \`${creationDate}\`
                        **Joined at** - \`${member.joinedAt.toString().slice(0, 15)}\`
                        `)
                        .addFields({
                            name: "Bannable by the bot",
                            value: "`" + YesOrNo(member.bannable) + "`",
                            inline: true
                        }, {
                            name: "Kickable by the bot",
                            value: "`" + YesOrNo(member.kickable) + "`",
                            inline: true
                        }, {
                            name: "Manageable by the bot",
                            value: "`" + YesOrNo(member.manageable) + "`",
                            inline: true
                        }, {
                            name: "Badges",
                            value: member.user.flags.toArray().length ? member.user.flags.toArray().map(flag => flags[flag]).join(' ') : '`None`'
                        }, {
                            name: `Roles (${member.roles.cache.size - 1})`,
                            value: member.roles.cache.map(r => `${r}`).slice(0, -1).join(' '),
                            inline: false
                        })

                    msg.edit(moreinfoembed)
                });
            });

    }
}