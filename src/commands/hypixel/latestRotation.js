const Command = require(`../../utils/command`)
const Discord = require(`discord.js`)
const { getLatestRotation, getLastEdit } = require(`../../utils/getMaps`)
const { design: { colourScheme, images }, bot } = require(`../../config.json`)


module.exports = class extends Command {
	constructor() {
		super({
			name: "rotation",
			description: "Get the lastest map rotation",
			aliases: [
				"rotations",
				"maprotations",
				"maprotation",
				"rot"
			],
			category: "hypixel",
			usage: "rotation",
			example: "rotation",
			settings: {
				"locked": true,
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
		const currentMaps = await getLatestRotation()
		const lastEdit = getLastEdit()

		const embed = new Discord.MessageEmbed()
			.setColor(colourScheme.default)
			.setTitle("Latest Map Rotation")
			.setThumbnail(images.gamemodes.bedwars)
			.setDescription(`Latest Map Rotation: <t:${lastEdit}:R>`)
			.setFooter(bot.name);

		for (const [i, mapList] of currentMaps.entries()) {
			let list = "```diff\n";
			for (const maps of mapList) {
				list += `${i % 2 == 0 ? "+" : "-"} ${maps}\n`;
			}
			list += "```"
			embed.addField(i % 2 == 0 ? "Added" : "Removed", list, true)
		}

		return message.channel.send({ embeds: [embed] })
	}
}