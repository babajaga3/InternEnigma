const BaseEvent = require('../../utils/structures/BaseEvent');
const {
    MessageEmbed
} = require('discord.js');
module.exports = class MessageEvent extends BaseEvent {
    constructor() {
        super({ name: 'error' });
    }

    async run(client, message, error) {
        if (error instanceof TypeError) {
            console.log("Invalid Params: \n", error.name + error.message)
        }
    }
}