const Command = require(`../../utils/command`)
const { MessageEmbed } = require(`discord.js`)
const { playerStats } = require(`../../utils/api/hypixel`)
const { bot, design: { colourScheme } } = require(`../../config.json`)
const colours = require(`../../utils/json/starColours.json`)

module.exports = class extends Command {
	constructor() {
		super({
			name: "index",
			description: "Get your index score!",
			aliases: [],
			category: "bedwars guild",
			usage: "index [IGN]",
			example: "index gamerboy80",
			settings: {
				"cooldown": 5000,
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
		const player = await playerStats(args[0]);

		if (!player?.stats?.Bedwars) throw new Error(`This user has never played bedwars!`)

		let FKDRNeeded = '-'
		let starNeeded = '-';
		let star = player.achievements.bedwars_level;
		let FKDR = player.stats.Bedwars.final_kills_bedwars / player.stats.Bedwars.final_deaths_bedwars;
		let index = (star * FKDR * FKDR) / 10;
		let playerHead = `https://minotar.net/helm/${player.uuid}.png`
		if (index < 30) {
			starNeeded = ((30 * 10) / ((FKDR * FKDR))).toFixed(2);
			FKDRNeeded = (Math.sqrt((30 * 10) / star)).toFixed(2);
		}

		const indexEmbed = new MessageEmbed()
			.setColor(colours[Math.floor(star / 100)])
			.setTitle('Index Score of ' + player.displayname.replace(/_/g, '\\_'))
			.setThumbnail(playerHead)
			.addFields(
				{ name: '**__Star__**', value: `\`\`\`${star}\`\`\``, inline: true },
				{ name: '**__Needed__**', value: `\`\`\`${starNeeded}\`\`\``, inline: true },
				{ name: '\u200B', value: '\u200B', inline: true },
				{ name: '**__FKDR__**', value: `\`\`\`${FKDR.toFixed(2)}\`\`\``, inline: true },
				{ name: '**__Needed__**', value: `\`\`\`${FKDRNeeded}\`\`\``, inline: true },
				{ name: '\u200B', value: '\u200B', inline: true },
				{ name: '**__Index__**', value: `\`\`\`${index.toFixed(2)}\`\`\``, inline: false },
			)
			.setFooter(bot.name);
		return message.channel.send({ embeds: [indexEmbed] });
	}
}