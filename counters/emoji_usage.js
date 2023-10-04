const { Message } = require('discord.js');

const config = require('../config.json');

const emoji_uses_handler = require('../utils/emoji-uses-handler');

const EMOJI_REGEX = /((?<!\\)<a?:[^:]+:(\d+)>)|\p{Emoji_Presentation}|\p{Extended_Pictographic}/gmu;

const EMOJI_TYPE = {
	message: 'message',
	reaction: 'reaction'
};

/**
 *
 * @param {Message} message The message to handle
 * @param {Number} value_to_add The value to add to an emoji if it was used in the message (negative amount will take away the uses)
 */
module.exports.handle_message_emoji_usage = (message, value_to_add) => {
	if (!message?.channel?.isText()) return;
	const channel_or_thread_parent_id = message?.channel?.isThread()
		? message?.channel?.parentId
		: message?.channel?.id;
	if (config.channel_ids.channels_ignore_emoji_counting.includes(channel_or_thread_parent_id)) return;
	const emojis = message.content.match(EMOJI_REGEX);
	if (!emojis) return;
	for (const emoji of emojis) {
		emoji_uses_handler.add_uses(emoji, EMOJI_TYPE.message, value_to_add);
	}
};
