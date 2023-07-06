process.on('unhandledRejection', async (reason, promise) => {
	console.log('Unhandled Rejection at:', promise, 'reason:', reason);
});

process.on('uncaughtException', async (err, origin) => {
	console.log(`Caught exception: ${err}\n` + `Exception origin: ${origin}`);
});

const Discord = require('discord.js');
const { Intents } = Discord;
require('dotenv').config();
const connectToMongo = require('./mongo');
const glory_sender = require('./runners/catch_the_glory.js');
const raver_announcer = require('./runners/raver_announcer.js');

const client = new Discord.Client({
	intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES]
});

client.on('ready', async () => {
	console.log('The bot is online!');
	console.log('Connecting to Mongo');
	await connectToMongo();
	let commandsInitialiser = require('./initialise-commands.js');
	if (commandsInitialiser.default) commandsInitialiser = commandsInitialiser.default;

	const commands = commandsInitialiser();

	let eventsInitialiser = require('./initialise-events.js');
	if (eventsInitialiser.default) eventsInitialiser = eventsInitialiser.default;

	const events = eventsInitialiser();

	const eventArgs = {
		messageCreate: commands
	};

	for (const event of events) {
		event.callback(client, eventArgs[event.name]);
	}

	raver_announcer(client);
	glory_sender(client);
});

client.login(process.env.BOT_TOKEN);

module.exports = client;
