const mongoose = require('mongoose');

const reqString = {
	type: String,
	required: true
};

const num0 = {
	type: Number,
	default: 0
};

const schema = new mongoose.Schema({
	_id: reqString,
	negacy: num0
});

module.exports = mongoose.model('points', schema, 'points');
