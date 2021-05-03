const BaseCommand = require('../../utils/structures/BaseCommand.js');
const emojis = require('../../utils/config/emojis.json');
const { messageOrEmbed } = require("../../utils/models/converter.js");

module.exports = class PresenceCommand extends BaseCommand {
    constructor() {
        super({
            name: "setpresence",
            description: "Change the bot's presence",
            usage: "<New Status> <New Presence>",
            owner: true,
            category: "Owner",
            aliases: ['setp']
        });
    }

    async run(client, message, args) {
        const newStatus = args[0].toLowerCase();
        const newPresence = args.slice(1).join(" ");
        if (!newStatus || !['dnd', 'invisible', 'online', 'idle'].includes(newStatus)) return messageOrEmbed(client, "Please provide a valid status", message);
        if (!newPresence || newPresence.length > 32) return messageOrEmbed(client, "Please provide a valid new presence that is under 32 characters", message);

        client.user.setPresence({ activity: { name: newPresence }, status: newStatus });
        messageOrEmbed(client, "Presence has been updated", message);

    }
}
