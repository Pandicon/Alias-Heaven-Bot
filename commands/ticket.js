const config = require('../config.json');
const { member_report_command: report_config } = config;
const DJS = require('discord.js');
const { replyToMessage, sendMessage } = require('../utils/discord');
const { creator } = require('../config.json');
const { success, fail } = require('../colours.json');

module.exports = {
	commands: ['ticket'],
	permissionError: 'You need administrator permissions to run this command',
	permissions: [],
	expectedArgs: ['<alias> <Your message>'],
	minArgs: 1,
	callback: async (client, message, ...args) => {
		let ticket = args.join(' ');
		const server = client.guilds?.cache.get(config.server_id) ?? null;
		if (server === null) {
			const embed = new DJS.MessageEmbed()
				.setColor(fail)
				.setDescription(`Failed to fetch this server for the ticket...`)
				.setFooter(`Bot made by ${creator}`)
				.setTimestamp();
			replyToMessage(message, true, '', [embed]);
			return;
		}
		const tickets_channel = server.channels?.cache.get(report_config.channel_id) ?? null;
		if (tickets_channel === null) {
			const embed = new DJS.MessageEmbed()
				.setColor(fail)
				.setDescription(`Failed to fetch the tickets channel...`)
				.setFooter(`Bot made by ${creator}`)
				.setTimestamp();
			replyToMessage(message, true, '', [embed]);
			return;
		}
		const ticket_embed = new DJS.MessageEmbed()
			.setAuthor(message.member.user.tag, message.member.user.displayAvatarURL({ dynamic: true }))
			.setColor(success)
			.setTitle(`New ticket`)
			.addFields(
				{
					name: 'Ticket by',
					value: `${message.member} (${message.member.user.tag})`
				},
				{
					name: 'Ticket message',
					value: ticket
				}
			)
			.setFooter(`Bot made by ${creator}`)
			.setTimestamp();
		const ticket_message = await sendMessage(tickets_channel, '', [ticket_embed]);

		const success_embed = new DJS.MessageEmbed()
			.setColor(success)
			.setDescription(`Ticket send successfully`)
			.setFooter(`Bot made by ${creator}`)
			.setTimestamp();
		replyToMessage(message, true, '', [success_embed]);

		if (!ticket_message) {
			return;
		}

		let thread_name = `${message.member.user.tag} - ${ticket}`;
		if (thread_name.length > 100) {
			thread_name = thread_name.substring(0, 97) + '...';
		}
		const thread = await tickets_channel.threads.create({
			name: thread_name,
			autoArchiveDuration: 60 * 24,
			reason: `Ticket for ${message.member.user.tag} - ${ticket}`,
			startMessage: ticket_message
		});
		await thread.members.add(message.member.user.id);
	}
};
