const BaseCommand = require("../../utils/structures/BaseCommand.js");
const Discord = require('discord.js');
const { MessageEmbed, MessageAttachment } = require("discord.js");
const emoji = require("../../utils/config/emojis.json");
const { Type } = require('@anishshobith/deeptype');
const { inspect } = require('util');
const { messageOrEmbed, genId } = require("../../utils/models/converter.js");
require("dotenv").config();

function clean(client, text) {
    if (typeof text === "string") {
        text = text
            .replace(/`/g, `\`${String.fromCharCode(8203)}`)
            .replace(/@/g, `@${String.fromCharCode(8203)}`)
            .replace(new RegExp(client.token, 'gi'), 'you are stupid')
    }
    return text;
}


async function postHast(content) {
    const axios = require('axios');
    const body = await axios.post('https://pastie.io/documents', content);
    return `https://pastie.io/${body.data.key}`;
}


module.exports = class EvalCommand extends BaseCommand {
    constructor() {
        super({
            name: "eval",
            category: "Owner",
            aliases: ["e", "ev"],
            description: "Evals a piece of JS code",
            owner: true,
        });
    }

    async run(client, message, args) {
        let input = args.join(' '),
            hasAwait = input.includes('await'),
            hasReturn = input.includes('return'),
            evaled,
            startTime = Date.now();
        if (!input) return message.reply('Give me input bruh', );

        try {
            evaled = hasAwait ? await eval(`(async () => { ${hasReturn ? ' ' : 'return'} ${input} })()`) : eval(input);
            if (typeof evaled != 'string') {
                evaled = inspect(evaled, {
                    depth: +!(inspect(evaled, { depth: 1 }))
                        //depth: 1
                });
            }
        } catch (err) {
            evaled = err;
        }

        evaled = evaled.toString();

        if (!evaled) return message.reply('Nothing returned');

        if (evaled.length > 1800) {
            const link = await postHast(`${input}\n\n\n${evaled}`);
            return message.reply(`${link}.js`);
        } else {
            return message.channel.send(`${Date.now() - startTime} ms\`\`\`js\n${clean(client, evaled)}\`\`\``);
        }
    }
};