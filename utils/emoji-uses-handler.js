const emoji_uses_schema = require('../schemas/emoji-uses-schema');
const { points: categories } = require('../config.json');

const cache = {};

const get_uses = async (emoji) => {
	if (cache[emoji]) return cache[emoji];
	const result = (await emoji_uses_schema.findOne({ _id: emoji })) || {};
	let object = {};
	for (const category of categories) {
		object[category] = result[category] || 0;
	}
	cache[emoji] = object;
	return object;
};

/**
 *
 * @param {String} emoji The emoji
 * @param {String} type The emoji type ("message"/"reaction")
 * @param {Number} amount The amount to add (if negative, the amount will be removed)
 */
const add_uses = async (emoji, type, amount) => {
	if (!cache[emoji]) {
		cache[emoji] = await get_uses(emoji);
	}
	let object = {};
	if (type == 'message') {
		object = {
			messages: amount
		};
	} else if (type == 'reaction') {
		object = {
			reactions: amount
		};
	}
	await emoji_uses_schema.findByIdAndUpdate(
		emoji,
		{
			$inc: object
		},
		{
			new: true,
			upsert: true
		}
	);
	cache[emoji][type] += amount;
	return cache[emoji][type];
};

module.exports = {
	get_uses: get_uses,
	add_uses: add_uses
};
