const pointsSchema = require('../schemas/points-schema');
const { points: categories } = require('../config.json');

const cache = {};

const get_points = async (userId) => {
	if (cache[userId]) return cache[userId];
	const result = (await pointsSchema.findOne({ _id: userId })) || {};
	let object = {};
	for (const category of categories) {
		object[category] = result[category] || 0;
	}
	cache[userId] = object;
	return object;
};

const add_points = async (userId, category, amount) => {
	if (!cache[userId]) {
		cache[userId] = await get_points(userId);
	}
	let object = {};
	if (category == 'negacy') {
		object = {
			negacy: amount
		};
	}
	await pointsSchema.findByIdAndUpdate(
		userId,
		{
			$inc: object
		},
		{
			new: true,
			upsert: true
		}
	);
	cache[userId][category] += amount;
	return cache[userId][category];
};

module.exports = {
	get_points,
	add_points
};
