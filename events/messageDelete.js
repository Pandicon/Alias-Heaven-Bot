const emoji_usage_tracker = require('../counters/emoji_usage');

module.exports = {
	name: 'messageDelete',
	callback: (client) => {
		client.on('messageDelete', async (message) => {
			// Running the emoji usage tracker
			try {
				emoji_usage_tracker.handle_message_emoji_usage(message, -1);
			} catch (error) {
				console.log(error);
			}
		});
	}
};
