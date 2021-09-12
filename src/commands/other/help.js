const Command = require(`../../utils/command`)
const { MessageEmbed, MessageAttachment } = require(`discord.js`)
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
			let helpGroups = {}
			client.commands.forEach((command) => {
				const commandCategory = command.category || "other"
				if (!helpGroups[commandCategory]) helpGroups[commandCategory] = []
				helpGroups[commandCategory].push(`${command.settings.locked ? "🔒" : ""} ${command.name}`)
			})

			const helpEmbed = new MessageEmbed()
				.setColor(colourScheme.default)
				.setTitle(`Full Command List`)
				.setDescription(`Do \`${defaultPrefix}help (command)\` to see more info about a command!`)
				.setFooter(`🔒 means a command is currently locked`)

			for (const [category, commands] of Object.entries(helpGroups)) {
				const commandList = `\`\`\`\n${commands.join("\n")}\`\`\``
				const commandCategory = `**__${category.charAt(0).toUpperCase() + category.slice(1)}__**`
				helpEmbed.addField(commandCategory, commandList, true)
			}

			return message.channel.send({ embeds: [helpEmbed] })
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
				{ name: `**__Category__**`, value: `${bulletPoint} ${command?.category ?? other}`, inline: false },
				{ name: `**__Usage__**`, value: `${bulletPoint} ${command?.usage ?? "Some idiot left usage out, sorry"}`, inline: false },
				{ name: `**__Example__**`, value: `${bulletPoint} ${command?.example ?? "Some idiot didn't add an example, sorry"}`, inline: false },
			])
		if (commandAliases.length > 0) helpEmbed.addField(`**__Aliases__**`, `${bulletPoint} ${commandAliases.join(`\n`)}`, false)
		helpEmbed.addField(`**__Cooldown__**`, `${bulletPoint} ${command?.settings?.cooldown / 1000 ?? "None!"}${command?.settings?.cooldown ? "s" : null}`, false)

		message.channel.send({ embeds: [helpEmbed] })
	}
}