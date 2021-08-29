const Command = require(`../../utils/command`)
const { MessageEmbed, MessageAttachment } = require(`discord.js`)
const config = require(`../../config.json`)

module.exports = class extends Command {
	constructor() {
		super({
			name: "eval",
			description: "Execute code with the bot",
			aliases: [
				"hax",
				"hackbot"
			],
			category: "dev",
			usage: "eval <code> <flags>",
			example: "eval message.channel.send(`Hi!`) --silent",
			settings: {
				"devOnly": true,
				"args": [],
				"perms": [
					"SEND_MESSAGES",
					"EMBED_LINKS"
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
		const flags = [...message.content.matchAll(/--\w+/g)];
		try {
			const code = args.join(" ").replace(/--\w+/g, '');

			let result = await eval(flags.flat().includes("--async") ? `(async () => {${code} })()` : code);

			if (flags.flat().includes("--silent")) return message.delete();

			if (typeof (result) == "object") result = JSON.stringify(result).replace(/{/g, "{\n  ").replace(/}/g, "\n}").replace(/,/g, ",\n  ");
			if (result?.length >= 1000) message.channel.send({ files: [new MessageAttachment(Buffer.from(result), 'result.js')] });

			let embed = new MessageEmbed()
				.setColor(config.design.colourScheme.success)
				.setTimestamp()
				.setFooter(config.bot.name, client.user.displayAvatarURL())
				.setTitle(`Eval ${result?.length >= 1000 ? `- Output too big, see file` : ""}`)
				.addField("Input:", `\`\`\`js\n${String(code).slice(0, 1006)}\n\`\`\``)
				.addField("Output:", `\`\`\`js\n${result?.length >= 1000 ? "See file" : String(result).slice(0, 1006)}\n\`\`\``);
			message.channel.send({ embeds: [embed] })
		}
		catch (e) {
			if (flags.flat().includes("--silent")) return;
			let embed = new MessageEmbed()
				.setColor(config.design.colourScheme.error)
				.setTimestamp()
				.setFooter(config.bot.name, client.user.displayAvatarURL())
				.setTitle("Error ¯\\_(ツ)_/¯")
				.setDescription(String(e).slice(0, 1024))
			message.channel.send({ embeds: [embed] })
		}
	}
}