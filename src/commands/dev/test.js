const Command = require("../../utils/command")
const Discord = require("discord.js")

module.exports = class extends Command {
	constructor() {
		super({
			name: "test",
			description: "Testing command as first command",
			aliases: [
				"bingbong",
			],
			category: "dev",
			usage: "test",
			example: "test",
			settings: {
				locked: true,
				devOnly: false,
				cooldown: 5000,
				perms: [
					"SEND_MESSAGES",
				]
			}
		})
	}

	/**
	 * Params for command
	 * @param {string} message
	 * @param {string[]} args 
	 * @param {object} client 
	 */
	async run(message, args, client) {
		if (args[0]?.toLowerCase() === "error") throw new Error("L")
		message.channel.send("ok")
	}
}