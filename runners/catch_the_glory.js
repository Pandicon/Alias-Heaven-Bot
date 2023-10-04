const config = require('../config.json');
const { glory: glory_config } = config;
const glory_schema = require('../schemas/glory-schema');
const timer = require('../utils/timer.js');

const ms_in_day = 24 * 60 * 60 * 1000;

module.exports = async (client) => {
	const res = (await glory_schema.findOne({ _id: '0' }).lean()) ?? {
		last_glory_post: '0'
	};
	let last_glory_post = parseInt(res.last_glory_post);
	let time_to_wait = 0;
	if (last_glory_post + glory_config.period < Date.now()) {
		time_to_wait = Math.floor(Math.random() * 60 * 60 * 1000); // Wait up to an hour after startup if a glory message wasn't posted in the last 24 hours
	} else {
		time_to_wait = ms_in_day - (Date.now() % ms_in_day) + Math.floor(Math.random() * glory_config.period); // Wait till the end of the UTC day + a random time between 0 and the period -> should post once every <period> UTC days
	}
	await timer(time_to_wait);
	while (true) {
		const time_now = Date.now();
		post_glory(client);
		await glory_schema.findOneAndUpdate(
			{ _id: '0' },
			{ _id: '0', last_glory_post: time_now.toString() },
			{ upsert: true }
		);
		time_to_wait = ms_in_day - (Date.now() % ms_in_day) + Math.floor(Math.random() * glory_config.period);
		await timer(time_to_wait);
	}
};

async function post_glory(client) {
	const server = client.guilds?.cache.get(config.server_id) ?? null;
	if (server === null) return;
	const channels = [];
	for (const channel_id of glory_config.channels) {
		const channel = server.channels?.cache.get(channel_id) ?? null;
		if (channel != null) {
			channels.push(channel);
		}
	}
	if (channels.length == 0) return;
	const channel = channels[Math.floor(Math.random() * channels.length)] ?? null;
	if (channel === null) return;
	await channel.send({ content: 'Catch the glory!' });
}
