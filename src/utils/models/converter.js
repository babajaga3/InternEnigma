const discord = require('discord.js');
const client = new discord.Client();
const config = require('../config/config.json');

/**
 * @param {message} message 
 * @param {args} args 
 * @return {member} Returns a member
 */
function Member(message, user, exact) {
    if (!user) return null;

    //Mentions
    const regex = exact ? '<@!?([0-9]+)>$' : '<@!?([0-9]+)>';
    const mentionId = new RegExp(regex, 'g').exec(user);
    if (mentionId && mentionId.length > 1) {
        return message.guild.members.cache.find(u => u.id === mentionId[1]);
    }

    // check if it's username#1337
    if (user.indexOf('#') > -1) {
        const [name, discrim] = user.split('#');
        const nameDiscrimSearch = message.guild.members.cache.find(u => u.user.username === name && u.user.discriminator === discrim);
        if (nameDiscrimSearch) {
            return nameDiscrimSearch;
        }
    }

    // check if it's an id
    if (user.match(/^([0-9]+)$/)) {
        const userIdSearch = message.guild.members.cache.find(u => u.id === user);
        if (userIdSearch) {
            return userIdSearch;
        }
    }

    // Check if is by Username or Nickname
    const exactuserNameSearch = message.guild.members.cache.find(u => u.displayName.toLowerCase() === user.toLocaleLowerCase());
    if (exactuserNameSearch) {
        return exactuserNameSearch;
    }

    if (!exact) {
        const escapedUser = user.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
        const userNameSearch = message.guild.members.cache.find(u => u.displayName.match(new RegExp(`^${escapedUser}.*`, 'i')) != undefined);
        if (userNameSearch) {
            return userNameSearch;
        }
    }

    return null;
    
}

/**
 * @param {message} message 
 * @param {args} channel 
 * @return {channel} Returns a channel
 */
function Channel(message, channel) {
    //Check if is a mention
    const mention = new RegExp('<#([0-9]+)', 'g').exec(channel);
    if (mention && mention.length > 1) {
        return message.guild.channels.cache.get(mention[1]);
    }

    //Check if is a ID
    if (channel.match(/^([0-9]+)$/)) {
        const channelIdSearch = message.guild.channels.cache.get(channel);
        if (channelIdSearch) {
            return channelIdSearch;
        }
    }

    //Check if is a Name
    const channelNameSearch = message.guild.channels.cache.find(c => c.name === channel);
    if (channelNameSearch) {
        return channelNameSearch;
    }
}

/**
 * @param {message} message 
 * @param {args} args 
 * @return {role} Returns a role
 */
function Role(message, role) {
    //Mentions
    const mention = new RegExp('<@&([0-9]+)>', 'g').exec(role);
    if (mention && mention.length > 1) {
        returnmessage.guild.members.cache.get(mention[1]);
    }

    // check if it's an id
    if (role.match(/^([0-9]+)$/)) {
        const roleIdSearch = message.guild.members.cache.get(role);
        if (roleIdSearch) {
            return roleIdSearch;
        }
    }

    const exactNameSearch = message.guild.members.cache.find(r => r.name.toLowerCase() === role.toLowerCase());
    if (exactNameSearch) {
        return exactNameSearch;
    }

    // eslint-disable-next-line no-useless-escape
    const escapedRole = role.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
    const roleNameSearch = message.guild.members.cache.find(r => r.name.match(new RegExp(`^${escapedRole}.*`, 'i')) != undefined);
    if (roleNameSearch) {
        return roleNameSearch;
    }

    return null;
}

/**
 * @param {message} message 
 * @param {args} args
 * @return {emoji} Returns an emoji 
 */
function Emoji(message, args) {
    var emoji = message.mentions.emojis.first() || message.guild.emojis.cache.get(args[0]);
    return emoji;
}

/**
 * @param {bool} bool Bool to be converted
 */
function YesOrNo(bool) {
    var answer = ""
    if (bool) {
        answer += "Yes"
    } else {
        answer += "No"
    }
    return answer;
}

/**
 * @param {number} time Seconds returned
 */
function Seconds(time) {
    var seconds = time * 1000
    return seconds;
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms * 1000));
}

/**
 * @param {number} number Length of the ID generated
 */
function genId(length) {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}


/**
 * @param {string} text Text to be sent
 * @param {message} message Message param
 */
function messageOrEmbed(client, text, message) {
    const cacheData = client.guildSettings.get(message.guild.id)

    if (!cacheData?.embedOnOrOff || cacheData?.embedOnOrOff === false || cacheData?.embedOnOrOff === null || !message.guild) {
        message.channel.send(text);
    }
    if (cacheData?.embedOnOrOff === true) {
        const embed = new discord.MessageEmbed()
            .setColor(message.member.displayHexColor || 'RANDOM')
            .setDescription(text);
        message.channel.send(embed);
    }

}

module.exports = {
    Member,
    Channel,
    Role,
    YesOrNo,
    Seconds,
    Emoji,
    sleep,
    messageOrEmbed,
    genId
}