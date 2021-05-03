const mongoose = require('mongoose');

const tagSchema = new mongoose.Schema({
	guild: { type: String, required: true, index: true },
	author: { type: Object, required: true },
	tag: { type: String },
	content: { type: String },
	createdAt: { type: Date, default: Date.now },
    uses: { type: Number }
});

module.exports = mongoose.model('tags', tagSchema);