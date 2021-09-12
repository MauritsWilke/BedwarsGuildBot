const Command = require(`../../utils/command`)
const { MessageEmbed } = require(`discord.js`)
const { bot, design: { colourScheme } } = require(`../../config.json`)

module.exports = class extends Command {
	constructor() {
		super({
			name: "serverInfo",
			description: "Get info about the current server",
			aliases: [
				"si",
				"serverifno",
				"serverinf"
			],
			category: "other",
			usage: "serverinfo",
			example: "serverinfo",
			settings: {
				"cooldown": 5000,
				"perms": [
					"SEND_MESSAGES"
				],
			}
		})
	}

	/**
	 * Params for command
	 * @param {string} message - The message of the user
	 * @param {string[]} args - The arguments of the message, does not include command
	 * @param {object} client - The client itself
	*/
	async run(message, args, client) {
		let voiceChannelCount = message.guild.channels.cache.filter(c => c.type === 'GUILD_VOICE' || c.type === `GUILD_STAGE_VOICE`).size;
		let textChannelCount = message.guild.channels.cache.filter(c => c.type === 'GUILD_TEXT').size;

		const serverEmbed = new MessageEmbed()
			.setTitle(`${message.guild.name} | info`)
			.setThumbnail(message.guild.iconURL())
			.setColor(colourScheme.default)
			.addFields(
				{ name: '**__Created At__**', value: `<t:${Math.floor(message.guild.createdTimestamp / 1000)}>`, inline: false },
				{ name: '**__Owner__**', value: `<@${message.guild.ownerId}>`, inline: true },
				{ name: '**__Members__**', value: `\`\`\`${message.guild.memberCount}\`\`\``, inline: true },

				{ name: '**__Vanity Url__**', value: `\`\`\`${message.guild.vanityURLCode || "None"}\`\`\``, inline: true },
				{ name: '**__Text Channels__**', value: `\`\`\`${textChannelCount}\`\`\``, inline: true },
				{ name: '**__Voice Channels__**', value: `\`\`\`${voiceChannelCount}\`\`\``, inline: true },
				{ name: '**__Rules__**', value: `${message.guild.rulesChannel ? message.guild.rulesChannel : "\`\`\`\nNone\`\`\`"}`, inline: true },

				{ name: '**__Boosts__**', value: `\`\`\`${message.guild.premiumSubscriptionCount}\`\`\``, inline: true },
				{ name: '**__Verified__**', value: `\`\`\`${toYN(message.guild.verified)}\`\`\``, inline: true },
				{ name: '**__Partnered__**', value: `\`\`\`${toYN(message.guild.partnered)}\`\`\``, inline: true },
			)
			.setFooter(bot.name);

		message.channel.send({ embeds: [serverEmbed] });
	}
}

function capitalize(s) {
	if (typeof s !== 'string') return ''
	return s.charAt(0).toUpperCase() + s.slice(1)
}

function toYN(s) {
	if (s == false) return 'No'
	return 'Yes'
}