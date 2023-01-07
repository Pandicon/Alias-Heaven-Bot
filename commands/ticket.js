const config = require('../config.json');
const { ticket_command: tickets_config } = config;
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
		const tickets_category = server.channels?.cache.get(tickets_config.category_id) ?? null;
		if (tickets_category === null) {
			const embed = new DJS.MessageEmbed()
				.setColor(fail)
				.setDescription(`Failed to fetch the tickets category...`)
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

		const max_name_len = 100;
		let channel_name = `${message.member.user.tag} - ${ticket}`;
		if (channel_name.length > max_name_len) {
			channel_name = channel_name.substring(0, max_name_len - 3) + '...';
		}
		const ticket_channel = await message.guild.channels.create(channel_name, {
			type: 'GUILD_TEXT',
			parent: tickets_category,
			permissionOverwrites: [
				{
					id: message.guild.id,
					deny: ['VIEW_CHANNEL']
				},
				{
					id: message.member.user.id,
					allow: ['VIEW_CHANNEL']
				},
				{
					id: config.roles.staff,
					allow: ['VIEW_CHANNEL']
				},
				{
					id: config.roles.prestaff,
					allow: ['VIEW_CHANNEL']
				}
			],
			reason: `Creating a ticket for ${message.member.user.tag}`
		});
		if (!ticket_channel) {
			const embed = new DJS.MessageEmbed()
				.setColor(fail)
				.setDescription(`Failed to create the tickets channel...`)
				.setFooter(`Bot made by ${creator}`)
				.setTimestamp();
			replyToMessage(message, true, '', [embed]);
			return;
		}
		sendMessage(ticket_channel, '', [ticket_embed]);

		const success_embed = new DJS.MessageEmbed()
			.setColor(success)
			.setDescription(`Ticket sent successfully, go to ${ticket_channel} to chat with staff`)
			.setFooter(`Bot made by ${creator}`)
			.setTimestamp();
		replyToMessage(message, true, '', [success_embed]);
	}
};
