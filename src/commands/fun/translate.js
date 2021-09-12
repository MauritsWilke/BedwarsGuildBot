const Command = require(`../../utils/command`)
const { MessageEmbed } = require(`discord.js`)
const { bot } = require(`../../config.json`)

module.exports = class extends Command {
	constructor() {
		super({
			name: "translate",
			description: "Translate to Minecraft enchantment table!",
			aliases: [
				"enchant"
			],
			category: "fun",
			usage: "translate [text]",
			example: "translate Hi! Can you read this?",
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
		let msg = args.join(' ');

		let translate_map = {
			"a": "ᔑ",
			"b": "ʖ",
			"c": "ᓵ",
			"d": "↸",
			"e": "ᒷ",
			"f": "⎓",
			"g": "⊣",
			"h": "⍑",
			"i": "╎",
			"j": "⋮",
			"k": "ꖌ",
			"l": "ꖎ",
			"m": "ᒲ",
			"n": "リ",
			"o": "𝙹",
			"p": "!¡",
			"q": "ᑑ",
			"r": "∷",
			"s": "ᓭ",
			"t": "ℸ ̣ ",
			"u": "⚍",
			"v": "⍊",
			"w": "∴",
			"x": " ̇/",
			"y": "||",
			"z": "⨅",
			" ": " "
		}

		String.prototype.translate = function () {
			return this.replace(/[a-z]/g,
				function (a) {
					return translate_map[a]
				})
		};

		let embed = new MessageEmbed()
			.setColor('#AA00AA')
			.setFooter(bot.name)
			.setThumbnail("https://cdn.discordapp.com/attachments/834039658391928852/838066476946685992/latest.png")
			.setTitle("Enchantment Table")
			.addField("**__Enchanting__**", `\`\`\`${msg}\`\`\``)
			.addField("**__Enchanted__**", `\`\`\`${msg.toLowerCase().translate()}\`\`\``);
		message.channel.send({ embeds: [embed] })
	}
}