const config = require('../config.json');
const { raver: raver_config } = config;
const raver_schema = require('../schemas/raver-schema');
const timer = require('../utils/timer.js');

const ms_in_day = 24 * 60 * 60 * 1000;

module.exports = async (client) => {
	const res = (await raver_schema.findOne({ _id: '0' }).lean()) ?? {
		last_random_run: '0',
		last_event: '0'
	};
	let last_random_run = parseInt(res.last_random_run);
	let last_event = parseInt(res.last_event);
	await timer(ms_in_day - (Date.now() % ms_in_day));
	while (true) {
		const time_now = Date.now();
		last_random_run = time_now;
		const time_since_event = last_event - time_now;
		if (time_since_event > raver_config.max_days * ms_in_day) {
			last_event = time_now;
			host(client, time_now);
		} else if (time_since_event > raver_config.min_days * ms_in_day) {
			if (Math.floor(Math.random() * raver_config.chance) === 5) {
				last_event = time_now;
				host(client, time_now);
			}
		}
		await raver_schema.findOneAndUpdate(
			{ _id: '0' },
			{ _id: '0', last_random_run: time_now.toString(), last_event: last_event.toString() },
			{ upsert: true }
		);
		await timer(ms_in_day);
	}
};

async function host(client) {
	const server = client.guilds?.cache.get(config.server_id) ?? null;
	if (server === null) return;
	const channel = server.channels?.cache.get(raver_config.channel_id) ?? null;
	if (channel === null) return;
	const possible_tasks = raver_config.tasks;
	const tasks = [];
	tasks.push(...possible_tasks.splice(Math.floor(Math.random() * possible_tasks.length), 1));
	tasks.push(...possible_tasks.splice(Math.floor(Math.random() * possible_tasks.length), 1));
	if (tasks[1] === 'memes') {
		const holder = tasks[0];
		tasks[0] = 'memes';
		tasks[1] = holder;
	}
	const tasks_limits = [raver_config.tasks_limits[tasks[0]], raver_config.tasks_limits[tasks[1]]];
	const tasks_descriptions = [raver_config.tasks_descriptions[tasks[0]], raver_config.tasks_descriptions[tasks[1]]];
	let first_fraction = -1;
	const first_amount = Math.floor(Math.random() * (tasks_limits[0][1] - tasks_limits[0][0])) + tasks_limits[0][0];
	if (tasks[0] !== 'memes')
		first_fraction = (first_amount - tasks_limits[0][0]) / (tasks_limits[0][1] - tasks_limits[0][0]);
	else first_fraction = Math.random() * 0.25;
	let second_amount = 0;
	if (first_fraction > 0) {
		if (first_fraction < 0.05) first_fraction = 0.05;
		if (first_fraction > 0.95) first_fraction = 0.95;
		const fraction = 1 - (Math.random() * 0.1 - 0.05 + first_fraction);
		second_amount = Math.round(fraction * (tasks_limits[1][1] - tasks_limits[1][0])) + tasks_limits[1][0];
	}
	tasks_descriptions[0] = tasks_descriptions[0].replace('*', first_amount.toString());
	tasks_descriptions[1] = tasks_descriptions[1].replace('*', second_amount.toString());
	let message =
		'Hello, the day of another Raver event has come!\n\nThis time, you have to complete the following tasks to get your next raver role:';
	message += tasks_descriptions.map((element) => '\n - ' + element).join('');
	const event_end = Math.round((Date.now() + ms_in_day) / 1000);
	message += `\n\nThe event ends on <t:${event_end}:F> (<t:${event_end}:R>)\n<@&${config.roles.event_ping}>`;
	await channel.send({ content: message });
}
