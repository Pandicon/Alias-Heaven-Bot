const { editMessage, replyToMessage } = require('../utils/discord');

module.exports = {
	commands: ['ping'],
	permissionError: '',
	permissions: [],
	expectedArgs: ['<alias>'],
	minArgs: 0,
	callback: async (client, message, ...args) => {
		replyToMessage(message, false, 'Calculating the ping...').then((resultMessage) => {
			const ping = resultMessage.createdTimestamp - message.createdTimestamp;
			editMessage(resultMessage, false, `**Bot latency:** ${ping}ms, **API latency:** ${client.ws.ping}ms`);
		});
	}
};
