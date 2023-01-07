const DJS = require('discord.js');
const { replyToMessage } = require('../../utils/discord');
const points_handler = require('../../utils/points-handler.js');
const { points: categories, creator } = require('../../config.json');
const actions = ['add', 'remove'];
const { success, fail } = require('../../colours.json');

module.exports = {
	commands: ['edit-points', 'editpoints', 'ep'],
	permissionError: 'You need manage roles permissions to run this command',
	permissions: ['MANAGE_ROLES'],
	expectedArgs: ['<alias> <mention> <category> <action> <amount>'],
	minArgs: 3,
	callback: async (client, message, ...args) => {
		const embed = new DJS.MessageEmbed()
			.setAuthor(message.member.user.tag, message.member.user.displayAvatarURL({ dynamic: true }))
			.setFooter(`Bot made by ${creator}`)
			.setTimestamp();
		const member = message.mentions.members.first();
		const category = args[1].toLowerCase();
		let action = args[2].toLowerCase();
		const amount = parseInt(args[3]);
		if (action == 'a') action = 'add';
		if (action == 'r') action = 'remove';
		if (!actions.includes(action)) {
			embed
				.setColor(fail)
				.setDescription(`\`${action}\` is not a valid action. Valid actions: \`${actions.join(', ')}\``);
			replyToMessage(message, true, '', [embed]);
			return;
		}
		if (!member) {
			embed
				.setColor(fail)
				.setDescription(`Please mention someone to ${action} the points ${action == 'add' ? 'to' : 'from'}.`);
			replyToMessage(message, true, '', [embed]);
			return;
		}
		if (!categories.includes(category)) {
			embed
				.setColor(fail)
				.setDescription(
					`\`${category}\` is not a valid category. Valid categories: \`${categories.join(', ')}\`.`
				);
			replyToMessage(message, true, '', [embed]);
			return;
		}
		if (isNaN(amount) || amount != Math.floor(amount)) {
			embed.setColor(fail).setDescription(`Please enter a valid amount (needs to be a whole number).`);
			replyToMessage(message, true, '', [embed]);
			return;
		}
		let amount_to_add = amount;
		if (action == 'remove') amount_to_add = -amount;
		let total = await points_handler.add_points(member.id, category, amount_to_add);
		let action_string = action == 'add' ? 'Added' : 'Removed';
		embed
			.setColor(success)
			.setDescription(
				`${action_string} ${amount} ${category} point${amount == 1 ? '' : 's'} ${
					action == 'add' ? 'to' : 'from'
				} ${member}. They now have ${total} ${category} point${total == 1 ? '' : 's'}.`
			);
		replyToMessage(message, true, '', [embed]);
	}
};
