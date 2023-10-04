const mongoose = require('mongoose');

const reqString = {
	type: String,
	required: true
};

const schema = new mongoose.Schema({
	_id: reqString,
	last_glory_post: reqString,
});

module.exports = mongoose.model('catch the glory', schema, 'catch the glory');
