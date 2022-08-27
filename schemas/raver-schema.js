const mongoose = require('mongoose');

const reqString = {
	type: String,
	required: true
};

const schema = new mongoose.Schema({
	_id: reqString,
	last_random_run: reqString,
	last_event: reqString
});

module.exports = mongoose.model('raver event', schema, 'raver event');
