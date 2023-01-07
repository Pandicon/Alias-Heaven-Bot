const DJS = require('discord.js');
const { replyToMessage } = require('../utils/discord');
const points_handler = require('../utils/points-handler.js');
const { points: categories, creator } = require('../config.json');
const { success } = require('../colours.json');

function capitaliseFirstLetter(string) {
	return string.charAt(0).toUpperCase() + string.slice(1);
}

module.exports = {
	commands: ['points', 'p'],
	permissionError: 'You need administrator permissions to run this command',
	permissions: [],
	expectedArgs: ['<alias> [mention]'],
	minArgs: 0,
	callback: async (client, message, ...args) => {
		const member = message.mentions.members.first() || message.member;
		const points = await points_handler.get_points(member.id);
		let string = '';
		for (const category of categories) {
			string += `\n${capitaliseFirstLetter(category)}: ${points[category] || 0}`;
		}
		const embed = new DJS.MessageEmbed()
			.setAuthor(message.member.user.tag, message.member.user.displayAvatarURL({ dynamic: true }))
			.setColor(success)
			.setDescription(`**Points of ${member.user.tag}**${string}`)
			.setFooter(`Bot made by ${creator}`)
			.setTimestamp();
		replyToMessage(message, true, '', [embed]);
	}
};
