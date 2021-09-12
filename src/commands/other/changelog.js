const Command = require(`../../utils/command`)
const { MessageEmbed } = require(`discord.js`)
const { bot, design: { colourScheme }, changelog } = require(`../../config.json`)

module.exports = class extends Command {
	constructor() {
		super({
			name: "changelog",
			description: "Get the latest changes to the bot",
			aliases: [],
			category: "other",
			usage: "changelog",
			example: "changelog",
			settings: {
				"cooldown": 3000,
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
		const changelogEmbed = new MessageEmbed()
			.setColor(colourScheme.default)
			.setTitle(`Changelog version ${bot.version}`)
			.setThumbnail(client.user.displayAvatarURL())
			.setFooter(bot.name);

		let description = "```diff\n";
		for (const changes in changelog) {
			description += `${changelog[changes]}\n`
		}
		description += "\n```"
		changelogEmbed.setDescription(description)

		message.channel.send({ embeds: [changelogEmbed] });
	}
}