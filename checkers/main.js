const { Message } = require('discord.js');

const config = require('../config.json');

const quackspam_check = require('./quackspam.js');

/**
 *
 * @param {Message} message The message to check
 */
module.exports.check = (message) => {
	let res = false;
	if (message?.channel?.id === config.channel_ids.quackspam) res ||= quackspam_check.check(message);
	return res;
};
