const BaseEvent = require('../../utils/structures/BaseEvent');
const guildDB = require('../../models/guildSettings')
const uri = process.env.MONGO;
const mongoose = require("mongoose");

module.exports = class ReadyEvent extends BaseEvent {
    constructor() {
        super({
            name: 'ready'
        });
    }
    async run(client) {
        mongoose.connect(uri, {
            useUnifiedTopology: true,
            useNewUrlParser: true,
            useFindAndModify: false,
            useCreateIndex: true
          }).then( console.log(`Connected to Mongo DB ✅`));

        //guild Settings 
        for(const guild of client.guilds.cache){
            const result = await guildDB.findOne({guildID: guild[1].id })
            if(result){
                client.guildSettings.set(guild[1].id , result.gConfig)
                }
            }

        const used = process.memoryUsage().heapUsed / 1024 / 1024;
        const memory = Math.round(used * 100) / 100;
        console.log(`\n\n${client.user.tag} has logged in - ${client.user.id}\nMemory Used: ${memory} MB\n\n`);
        client.user.setPresence({ activity: { name: 'lol'}, status: 'online'});
    }
}