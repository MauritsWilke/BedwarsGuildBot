const Command = require(`../../utils/command`)
const { MessageEmbed } = require(`discord.js`)
const { design: { colourScheme, other: { bulletPoint } }, bot: { defaultPrefix } } = require(`../../config.json`)

module.exports = class extends Command {
	constructor() {
		super({
			name: "help",
			description: "Get help with commands!",
			aliases: [],
			category: "other",
			usage: "help (command)",
			example: "help pfp",
			settings: {
				"cooldown": 2000,
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
		if (args.length == 0) {
			// let helpGroups = [];
			// client.commands.forEach((command, i) => {
			// 	helpGroups[i] ? 
			// })
			message.channel.send("Fuck u, full list W.I.P.")
		}

		const commandName = args[0].toLowerCase()
		const command = client.commands.get(commandName) ||
			client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));
		if (!command) return message.channel.send({ content: `That command does not exist!`, ephemeral: true });

		let commandAliases = []
		command?.aliases.forEach((alias) => commandAliases.push(alias))

		const helpEmbed = new MessageEmbed()
			.setColor(colourScheme.default)
			.setTitle(`${defaultPrefix}${command.name}`)
			.setDescription(`\`\`\`${command.description}\`\`\``)
			.addFields([
				{ name: `**Category**`, value: `${bulletPoint} ${command?.category ?? other}`, inline: false },
				{ name: `**Usage**`, value: `${bulletPoint} ${command?.usage ?? "Some idiot left usage out, sorry"}`, inline: false },
				{ name: `**Example**`, value: `${bulletPoint} ${command?.example ?? "Some idiot didn't add an example, sorry"}`, inline: false },
			])
		if (commandAliases.length > 0) helpEmbed.addField(`**Aliases**`, `${bulletPoint} ${commandAliases.join(`\n`)}`, false)
		helpEmbed.addField(`**Cooldown**`, `${bulletPoint} ${command?.settings?.cooldown / 1000 ?? "None!"}${command?.settings?.cooldown ? "s" : null}`, false)

		message.channel.send({ embeds: [helpEmbed] })
	}
}