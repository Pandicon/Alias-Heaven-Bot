const mongoose = require('mongoose');

const reqNumber = {
	type: Number,
	default: 0
};

const reqString = {
	type: String,
	required: true
};

const schema = new mongoose.Schema({
	_id: reqString,
	messages: reqNumber,
	reactions: reqNumber
});

module.exports = mongoose.model('emoji uses', schema, 'emoji uses');
