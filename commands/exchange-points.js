const DJS = require('discord.js');
const { replyToMessage } = require('../utils/discord');
const points_handler = require('../utils/points-handler.js');
const { points: categories, exchangeable_points, creator, points_for_role, roles: rs } = require('../config.json');
const { success, semifail, fail } = require('../colours.json');

function first_missing(roles, mroles) {
	for (const r of roles) {
		if (!mroles.includes(r)) return r;
	}
	return null;
}

module.exports = {
	commands: ['exchange-points', 'exp', 'exchangepoints'],
	permissionError: '',
	permissions: [],
	expectedArgs: ['<alias> <category> <role amount>'],
	minArgs: 2,
	callback: async (client, message, ...args) => {
		const member = message.member;
		let category = args[0].toLowerCase();
		let points = (await points_handler.get_points(member.id))[category];
		const to_give = parseInt(args[1]);
		let roles = rs[category];
		let mroles = await member.roles.cache;
		let roles_ids = [];
		const embed = new DJS.MessageEmbed().setAuthor(
			message.member.user.tag,
			message.member.user.displayAvatarURL({ dynamic: true })
		);
		if (!categories.includes(category)) {
			embed
				.setColor(fail)
				.setDescription(
					`\`${category}\` is not a valid category. Valid categories: \`${categories.join(', ')}\``
				);
			replyToMessage(message, true, '', [embed]);
			return;
		}
		if (!exchangeable_points.includes(category)) {
			embed
				.setColor(fail)
				.setDescription(
					`You can not exchange points from the \`${category}\` category for any roles. Point categories which can be exchanged: \`${exchangeable_points.join(
						', '
					)}\``
				);
			replyToMessage(message, true, '', [embed]);
			return;
		}
		if (isNaN(to_give) || to_give != Math.floor(to_give)) {
			embed.setColor(fail).setDescription(`Please enter a valid amount (has to be a whole number).`);
			replyToMessage(message, true, '', [embed]);
			return;
		}
		for (const [id, _] of mroles) {
			if (roles.includes(id)) roles_ids.push(id);
		}
		if (category == 'negacy') {
			if (roles_ids.includes(roles[roles.length - 1])) {
				embed.setColor(semifail).setDescription(`You can not exchange any more roles from this category.`);
				replyToMessage(message, true, '', [embed]);
				return;
			}
			if (points < points_for_role) {
				embed.setColor(fail).setDescription(`You don't have enough ${category} points for any roles.`);
				replyToMessage(message, true, '', [embed]);
				return;
			}
			let total = 0;
			let max = 0;
			for (let i = 0; i < roles.length - 1; i += 1) {
				if (roles_ids.includes(roles[i])) {
					total += Math.pow(2, i);
				}
				max += Math.pow(2, i);
			}
			max += 1;
			const max_minus_total = max - total;
			const given = Math.min(to_give, Math.floor(points / points_for_role), max_minus_total);
			total += given;
			let to_have = [];
			for (let i = 0; i < roles.length; i += 1) {
				to_have.push(total % 2 == 1);
				total -= total % 2;
				total /= 2;
			}
			if (to_have[to_have.length - 1]) {
				for (let i = 0; i < roles.length - 1; i += 1) {
					member.roles.remove(roles[i]);
				}
				member.roles.add(roles[roles.length - 1]);
			} else {
				for (let i = 0; i < roles.length - 1; i += 1) {
					if (roles_ids.includes(roles[i]) && !to_have[i]) {
						member.roles.remove(roles[i]);
					} else if (!roles_ids.includes(roles[i]) && to_have[i]) {
						member.roles.add(roles[i]);
					}
				}
			}
			await points_handler.add_points(member.id, category, -given * points_for_role);
			if (given == to_give) {
				embed
					.setColor(success)
					.setDescription(`Successfully gave you ${given} ${category} role${given == 1 ? '' : 's'}.`);
				replyToMessage(message, true, '', [embed]);
			} else if (given == max_minus_total) {
				embed
					.setColor(semifail)
					.setDescription(
						`I could only give you ${given} ${category} role${
							given == 1 ? '' : 's'
						}, because you got all of the roles.`
					);
				replyToMessage(message, true, '', [embed]);
			} else {
				embed
					.setColor(semifail)
					.setDescription(
						`I could only give you ${given} ${category} role${
							given == 1 ? '' : 's'
						}, because you didn't have points for more.`
					);
				replyToMessage(message, true, '', [embed]);
			}
			return;
		}
		if (points < points_for_role) {
			embed.setColor(fail).setDescription(`You don't have enough ${category} points for any roles.`);
			replyToMessage(message, true, '', [embed]);
			return;
		}
		let rtg = [];
		let max = false;
		while (points >= points_for_role && rtg.length < to_give && !max) {
			let to_give = first_missing(roles, roles_ids);
			if (!to_give) {
				max = true;
				break;
			}
			rtg.push(to_give);
			roles_ids.push(to_give);
			points = await points_handler.add_points(member.id, category, -points_for_role);
		}
		member.roles.add(rtg);
		if (rtg.length < to_give) {
			embed.setColor(semifail);
			if (max) {
				if (rtg.length == 0) {
					embed.setDescription(`I couldn't give you any roles, because you got all of them.`);
					replyToMessage(message, true, '', [embed]);
					return;
				}
				embed.setDescription(
					`I could only give you ${rtg.length} ${category} role${
						rtg.length == 1 ? '' : 's'
					}, because you got all of the roles.`
				);
				replyToMessage(message, true, '', [embed]);
				return;
			}
			embed.setDescription(
				`I could only give you ${rtg.length} ${category} role${
					rtg.length == 1 ? '' : 's'
				}, because you didn't have points for more.`
			);
			replyToMessage(message, true, '', [embed]);
			return;
		}
		embed
			.setColor(success)
			.setDescription(`Successfully gave you ${rtg.length} ${category} role${rtg.length == 1 ? '' : 's'}.`);
		replyToMessage(message, true, '', [embed]);
	}
};
