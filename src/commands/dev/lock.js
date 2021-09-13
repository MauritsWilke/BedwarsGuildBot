const Command = require(`../../utils/command`)
const { MessageEmbed } = require(`discord.js`)
const { bot: { defaultPrefix, name }, design: { colourScheme, images } } = require(`../../config.json`)

module.exports = class extends Command {
	constructor() {
		super({
			name: "lock",
			description: "Lock commands",
			aliases: [
				"unlock"
			],
			category: "dev",
			usage: "lock [command]",
			example: "lock pfp",
			settings: {
				"devOnly": true,
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
		if (!args[0]) throw new Error("This command requires an input!")
		const lockOrUnlock = message.content.slice(defaultPrefix.length).split(/ +/)[0]

		const commandName = args[0].toLowerCase();
		const command = client.commands.get(commandName) ||
			client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

		if (!command) {
			const lockedEmbed = new MessageEmbed()
				.setColor(colourScheme.error)
				.setTitle(`This command doesn't exist!`)
				.setThumbnail(images.failed)
				.setFooter(name);
			message.channel.send({ embeds: [lockedEmbed] })
				.then(m => { setTimeout(() => m.delete(), 15000) }).catch(e => { })
			return
		}

		command.settings.locked = lockOrUnlock == "lock";

		const lockedEmbed = new MessageEmbed()
			.setColor(colourScheme.success)
			.setTitle(`Succesfully ${lockOrUnlock}ed ${commandName}`)
			.setThumbnail(images.success)
			.setFooter(name);
		return message.channel.send({ embeds: [lockedEmbed] });
	}
}