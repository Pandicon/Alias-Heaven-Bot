const { Message } = require('discord.js');

const config = require('../config.json');

/**
 *
 * @param {Message} message The message to check
 */
module.exports.check = (message) => {
	if (!message?.deletable || message?.member?.permissionsIn(message?.channel).has('MANAGE_GUILD')) return false;
	const message_content = message?.content?.toLowerCase();
	if (message?.author?.bot && !message_content.includes(config.messages_patterns.level_up)) {
		message.delete().catch(() => {});
		return true;
	}
	if (
		!message_content.includes(config.messages_patterns.level_up) &&
		message_content != 'quackquack' &&
		message_content != 'quack' &&
		message_content != 'quack quack'
	) {
		message.delete().catch(() => {});
		return true;
	}
};
