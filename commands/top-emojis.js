const DJS = require('discord.js');
const { replyToMessage } = require('../utils/discord');
const { creator } = require('../config.json');
const { success, semifail } = require('../colours.json');

const emoji_uses_schema = require('../schemas/emoji-uses-schema');

module.exports = {
	commands: ['top-emojis', 'te'],
	permissionError: '',
	permissions: [],
	expectedArgs: ['<alias> [page]'],
	minArgs: 0,
	callback: async (client, message, ...args) => {
		let page = args.length > 0 && !isNaN(parseInt(args[0])) ? parseInt(args[0]) : 1;
		const limit = 25 * page;
		let text = '';

		const resultsAll = await emoji_uses_schema.find({}).sort({
			messages: -1
		});

		for (let counter = 25 * (page - 1); counter < limit; counter += 1) {
			if (!resultsAll[counter]) {
				break;
			}
			const { _id: emoji, messages: message_uses = 0 } = resultsAll[counter];

			let place = counter + 1;
			if (place == 1) {
				place = ':first_place:';
			} else if (place == 2) {
				place = ':second_place:';
			} else if (place == 3) {
				place = ':third_place:';
			} else {
				let placeLetters = 'th';
				const split = place.toString().split('');
				if (split.length > 1) {
					if (split[split.length - 1] == 1 && split[split.length - 2] != 1) {
						placeLetters = 'st';
					} else if (split[split.length - 1] == 2 && split[split.length - 2] != 1) {
						placeLetters = 'nd';
					} else if (split[split.length - 1] == 3 && split[split.length - 2] != 1) {
						placeLetters = 'rd';
					}
				} else {
					if (place == 1) {
						placeLetters = 'st';
					} else if (place == 2) {
						placeLetters = 'nd';
					} else if (place == 3) {
						placeLetters = 'rd';
					}
				}
				place = `**${place}${placeLetters}**`;
			}
			const split_emoji = emoji.split(':');
			if (split_emoji.length > 2) {
				split_emoji[2] = split_emoji[2].slice(0, -1);
				split_emoji[0] = split_emoji[0].slice(1);
			}
			const emoji_id = split_emoji.length > 2 ? split_emoji[2] : null;
			const can_show_emoji = !emoji_id || client.emojis.cache.get(emoji_id) != undefined;
			text += `${place} ${can_show_emoji ? emoji : `${split_emoji.join(':')}`} - ${message_uses.toLocaleString(
				'en-GB'
			)} use${message_uses == 1 ? '' : 's'}\n`;
		}
		let colour = success;
		if (!text) {
			text = 'No emojis are on this page - try a lower one\n';
			colour = semifail;
		}
		const embed = new DJS.MessageEmbed()
			.setAuthor(message.member.user.tag, message.member.user.displayAvatarURL({ dynamic: true }))
			.setColor(colour)
			.setDescription(text)
			.setFooter(`Page ${page} out of ${Math.ceil(resultsAll.length / 25)} • Bot made by ${creator}`)
			.setTimestamp();
		replyToMessage(message, false, '', [embed]);
	}
};
