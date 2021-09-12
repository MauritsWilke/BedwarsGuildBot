const Command = require(`../../utils/command`)
const { MessageEmbed } = require(`discord.js`)
const { bot, design: { colourScheme }, changelog } = require(`../../config.json`)

module.exports = class extends Command {
	constructor() {
		super({
			name: "ping",
			description: "Get the current ping of the bot",
			aliases: [],
			category: "other",
			usage: "ping",
			example: "ping",
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
		const pingEmbed = new MessageEmbed()
			.setColor(colourScheme.default)
			.setThumbnail(client.user.displayAvatarURL())
			.addFields(
				{ name: '**__Ping__**', value: `\`\`\`${client.ws.ping}ms\`\`\``, inline: false },
				{ name: '**__Roundtrip Latency__**', value: `\`\`\`Pinging...\`\`\``, inline: false }
			)
			.setFooter(bot.name);

		message.channel.send({ embeds: [pingEmbed] }).then(m => {
			const editedEmbed = new MessageEmbed()
				.setColor(colourScheme.default)
				.setThumbnail(client.user.displayAvatarURL())
				.addFields(
					{ name: '**__Ping__**', value: `\`\`\`${client.ws.ping}ms\`\`\``, inline: false },
					{ name: '**__Roundtrip Latency__**', value: `\`\`\`${m.createdTimestamp - message.createdTimestamp}ms\`\`\``, inline: false }
				)
				.setFooter(bot.name);
			m.edit({ embeds: [editedEmbed] })
		});
	}
}