const Command = require(`../../utils/command`)
const { MessageEmbed } = require(`discord.js`)
const { getCurrentMaps, getLastEdit, mapTypes } = require(`../../utils/getMaps`)
const { design: { colourScheme, images }, bot } = require(`../../config.json`)

module.exports = class extends Command {
	constructor() {
		super({
			name: "map",
			description: "Check if a map is available",
			aliases: [
				"maps",
				"mpas"
			],
			category: "hypixel",
			usage: "map <map name>",
			example: "map lighthouse",
			settings: {
				"cooldown": 5000,
				"perms": [
					"SEND_MESSAGES"
				],
				"args": [
					"map name"
				]
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
		let lastEdit = getLastEdit()
		const currentMaps = await getCurrentMaps(args[0] ? false : true);

		if (args[0]) {
			const mapToSearch = args.join(" ").toLowerCase();
			if (currentMaps.includes(mapToSearch)) {
				const embed = new MessageEmbed()
					.setColor(colourScheme.success)
					.setTitle(`${mapToSearch.charAt(0).toUpperCase() + mapToSearch.slice(1)} is available!`)
					.setDescription(`Latest Map Rotation: <t:${lastEdit}:R>`)
					.setThumbnail(images.gamemodes.bedwars)
					.setFooter(bot.name)
				return message.channel.send({ embeds: [embed] })
			}

			const embed = new MessageEmbed()
				.setColor(colourScheme.error)
				.setTitle(`${mapToSearch.charAt(0).toUpperCase() + mapToSearch.slice(1)} is not available`)
				.setDescription(`Latest Map Rotation: <t:${lastEdit}:R>`)
				.setThumbnail(images.gamemodes.bedwars)
				.setFooter(bot.name)
			return message.channel.send({ embeds: [embed] })
		}

		const embed = new MessageEmbed()
			.setColor(colourScheme.default)
			.setTitle("Current Available Maps")
			.setThumbnail(images.gamemodes.bedwars)
			.setDescription(`Latest Map Rotation: <t:${lastEdit}:R>`)
			.setFooter(bot.name);

		for (const [i, mapCollection] of currentMaps.entries()) {
			let mapList = "";
			for (const activeMap of mapCollection) {
				mapList += activeMap.length > 0 ? `\`•\` ${activeMap.charAt(0).toUpperCase() + activeMap.slice(1)}\n` : "";
			}
			embed.addField(mapTypes[i], mapList, true)
			if (i == 1 || i == 3) embed.addField("\u200B", "\u200B", true)
		}

		return message.channel.send({ embeds: [embed] })
	}
}