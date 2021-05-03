const mongoose = require('mongoose');
const config = require('../utils/config/config.json');
const guildSettings = new mongoose.Schema({
	guildID: { type: String, required: true },
	gConfig: {
		prefix: { type: String, default: config.prefix },
		globalDisabledCommand: { type: Array, default: [] },
		blacklistCommand: { type: Array, default: [] },
		blacklistUser: { type: Array, default: [] },
		blacklistChannel: { type: Array, default: [] },
		embedOnOrOff : {type: Boolean, default: false },
		NodmUser: { type: Array, default: [] },
        PCMessage: { type: String, default: null },
        PSMessage: { type: String, default: null },
        XBMessage: { type: String, default: null } 
	}
});

module.exports = mongoose.model('GuildSettings', guildSettings);