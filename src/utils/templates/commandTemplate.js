const Command = require(`../../utils/command`)
const Discord = require(`discord.js`)

module.exports = class extends Command {
	constructor() {
		super({
			name: "ExampleCommand",
			description: "This is an example command",
			aliases: [
				"example"
			],
			category: "example",
			usage: "hello <name>",
			example: "hello dennis",
			settings: {
				"locked": false,
				"devOnly": false,
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
		if (args.length == 0) message.reply("Please include a name")
		message.reply(`Hi ${args[0]}!`)
	}
}