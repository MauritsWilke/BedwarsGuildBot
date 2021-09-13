const Command = require(`../../utils/command`)
const { MessageEmbed, MessageActionRow, MessageButton } = require(`discord.js`)
const { design: { colourScheme, other: { githubRepo } }, bot, devs } = require(`../../config.json`)

module.exports = class extends Command {
	constructor() {
		super({
			name: "botinfo",
			description: "Retrieve info about the bot",
			aliases: [
				"invite"
			],
			category: "other",
			usage: "botinfo",
			example: "botinfo",
			settings: {
				"cooldown": 5000,
				"args": [],
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
		let totalSeconds = (client.uptime / 1000);
		let hours = Math.floor(totalSeconds / 3600);
		totalSeconds %= 3600;
		let minutes = Math.floor(totalSeconds / 60);
		let seconds = Math.floor(totalSeconds % 60);

		const row = new MessageActionRow()
			.addComponents(
				new MessageButton()
					.setLabel('GitHub')
					.setURL(`https://github.com/MauritsWilke/BedwarsGuildBot`)
					.setEmoji('846355712854851604')
					.setStyle('LINK'),
				new MessageButton()
					.setLabel('Support Server')
					.setURL(`https://discord.gg/VmAQ6rpsHg`)
					.setEmoji('834448218016186388')
					.setStyle('LINK'),
			);

		const newEmbed = new MessageEmbed()
			.setColor(colourScheme.default)
			.setTitle(`${bot.name} info`)
			.setThumbnail(client.user.displayAvatarURL())
			.addFields(
				{ name: 'Dev', value: `${devs[0].Name}`, inline: true },
				{ name: 'Ping', value: `${client.ws.ping}ms`, inline: true },
				{ name: 'Uptime', value: `${`${hours}h ${minutes}m ${seconds}s`}`, inline: true },

				{ name: 'Servers', value: `${client.guilds.cache.size}`, inline: true },
				{ name: 'Channels', value: `${client.channels.cache.size}`, inline: true },
				{ name: 'Users', value: `${client.users.cache.size}`, inline: true },

				{ name: 'Total Memory', value: `${(process.memoryUsage().rss / 1024 / 1024).toFixed(2)}mb`, inline: true },
				{ name: 'Memory used', value: `${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)}mb`, inline: true },
				{ name: 'Invite', value: `[Click here!](${bot.inviteLink})`, inline: true }
			)
			.setFooter(bot.name);

		return message.channel.send({ embeds: [newEmbed], components: [row] })
	}
}