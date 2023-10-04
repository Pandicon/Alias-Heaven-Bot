const DJS = require('discord.js');
const { replyToMessage } = require('../utils/discord');
const config = require('../config.json');
const { creator } = config;
const { success } = require('../colours.json');
const prefix_handler = require('../utils/prefix-handler.js');

function capitaliseFirstLetter(string) {
	return string.charAt(0).toUpperCase() + string.slice(1);
}

module.exports = {
	commands: ['help', 'h', 'commands', 'c'],
	permissionError: 'You need administrator permissions to run this command',
	permissions: [],
	expectedArgs: ['<alias>'],
	minArgs: 0,
	callback: async (client, message, ...args) => {
		const prefix = await prefix_handler.getPrefix(message.guild.id);
		const embed = new DJS.MessageEmbed()
			.setAuthor(message.member.user.tag, message.member.user.displayAvatarURL({ dynamic: true }))
			.setColor(success)
			.setTitle('Commands list')
			.addFields(
				{
					name: 'edit-points',
					value: `Aliases: ep, editpoints\nLets you manipulate points of members\nSyntax: <alias> <mention> <category> <action> <amount>\nExample use: ${prefix}ep <@576163015120912386> negacy add 5 (Will add 5 negacy points to <@576163015120912386>)\nRequired permissions: Manage roles`
				},
				{
					name: 'prefix',
					value: `Alias: change-prefix\nLets you change the server prefix\nSyntax: <alias> <new prefix>\nExample use: ${prefix}prefix pt! (Will change the server prefix to pt!)\nRequired permissions: Manage server`
				},
				{
					name: 'ticket-close',
					value: `Aliases: tclose, ticketclose\nLets you close a ticket by deleting its channel\nSyntax: <alias> <mention>\nExample use: ${prefix}tclose\nRequired permissions: Manage roles\nNote: The channel this command is ran in has to be in the <#${config.ticket_command.category_id}> category.`
				},
				{
					name: 'exchange-points',
					value: `Aliases: exp, exchangepoints\nLets you exchange points for roles\nSyntax: <alias> <category> <role amount>\nExample use: ${prefix}exchange-points negacy 2 (Will give you up to 2 negacy roles, depending on if you have enough points and if you don't have all the roles)\nRequired permissions: None`
				},
				{
					name: 'help',
					value: `Aliases: h, commands, c\nLets you view this menu\nSyntax: <alias>\nExample use: ${prefix}help (Will display this message)\nRequired permissions: None`
				},
				{
					name: 'ping',
					value: `Alias: ping\nCalculates the bot ping and API latency\nSyntax: <alias>\nExample use: ${prefix}ping\nRequired permissions: None`
				},
				{
					name: 'points',
					value: `Alias: p\nLets you view points you or the mentioned member has\nSyntax: <alias> [mention]\nExample use: ${prefix}points <@576163015120912386> (Will show how many points <@576163015120912386> has), ${prefix}points (Will show how many points you have)\nRequired permissions: None`
				},
				{
					name: 'ticket',
					value: `Aliases: None\nLets you create a ticket for communicating with the staff members\nSyntax: <alias> <your message>\nExample use: ${prefix}ticket I did not get access to the secret area even though I have the access role\nRequired permissions: None`
				},
				{
					name: 'top-emojis',
					value: `Aliases: te\nLets you see the most used emojis\nSyntax: <alias> [page]\nExample use: ${prefix}topemojis 3\nRequired permissions: None`
				}
			)
			.setDescription('Note: Arguments marked with <> are required, while those marked with [] are optional.')
			.setFooter(`Bot made by ${creator}`)
			.setTimestamp();
		replyToMessage(message, true, '', [embed]);
	}
};
