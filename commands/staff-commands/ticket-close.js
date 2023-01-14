const DJS = require('discord.js');
const { replyToMessage } = require('../../utils/discord');
const config = require('../../config.json');
const { creator } = require('../../config.json');
const { fail } = require('../../colours.json');

module.exports = {
	commands: ['ticket-close', 'ticketclose', 'tclose'],
	permissionError: 'You need manage roles permissions to run this command',
	permissions: ['MANAGE_ROLES'],
	expectedArgs: ['<alias>'],
	minArgs: 0,
	callback: async (client, message, ...args) => {
		if (message.channel.parentId != config.ticket_command.category_id) {
			const embed = new DJS.MessageEmbed()
				.setAuthor(message.member.user.tag, message.member.user.displayAvatarURL({ dynamic: true }))
				.setColor(fail)
				.setDescription(
					`Only channels in the <#${config.ticket_command.category_id}> are considered ticket channels and can be closed.`
				)
				.setFooter(`Bot made by ${creator}`)
				.setTimestamp();
			replyToMessage(message, true, '', [embed]);
			return;
		}
		if (config.ticket_command.non_ticket_channels.includes(message.channel.id)) {
			const embed = new DJS.MessageEmbed()
				.setAuthor(message.member.user.tag, message.member.user.displayAvatarURL({ dynamic: true }))
				.setColor(fail)
				.setDescription(`This channel is set to not be considered a ticket channel, so it can not be closed.`)
				.setFooter(`Bot made by ${creator}`)
				.setTimestamp();
			replyToMessage(message, true, '', [embed]);
			return;
		}
		message.channel.delete('Closing the ticket');
	}
};
