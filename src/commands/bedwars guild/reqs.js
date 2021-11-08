const Command = require(`../../utils/command`)
const { MessageEmbed } = require(`discord.js`)
const { bot } = require(`../../config.json`)
const { playerStats } = require(`../../utils/api/hypixel`)

module.exports = class extends Command {
	constructor() {
		super({
			name: "requirements",
			description: "Check if you meet the requirements for the guild!",
			aliases: [
				"req",
				"reqs",
				"requirement"
			],
			category: "bedwars guild",
			usage: "reqs [ign]",
			example: "reqs I_Like_Cats__",
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

		let star = player.achievements.bedwars_level;
		let FKDR = player.stats.Bedwars.final_kills_bedwars / player.stats.Bedwars.final_deaths_bedwars;
		let index = (star * FKDR * FKDR) / 10;
		let playerHead = `https://minotar.net/helm/${player.uuid}.png`
		let daysBetween = Math.floor((new Date() - new Date(player?.lastLogin)) / (1000 * 60 * 60 * 24))
		let playerDiscord = (player?.socialMedia?.links?.DISCORD === undefined) ? "Not linked" : player?.socialMedia?.links?.DISCORD;

		let meetsOne = client.users.cache.find(u => u?.tag === playerDiscord)?.id !== undefined ? ':white_check_mark:' : `:x:`;
		let meetsTwo = daysBetween <= 7 ? ':white_check_mark:' : `:x:`;
		let meetsThree = index >= 50 ? ':white_check_mark:' : `:x:`;
		let colour = meetsOne === ':white_check_mark:' && meetsTwo === ':white_check_mark:' && meetsThree === ':white_check_mark:' ? '#55FF55' : '#FF5555';

		const reqEmbed = new MessageEmbed()
			.setColor(colour)
			.setTitle('Requirement score of ' + player.displayname.replace(/_/g, '\\_'))
			.setThumbnail(playerHead)
			.addFields(
				{ name: '**__In The Discord__**', value: `${meetsOne} \`\`${playerDiscord}\`\``, inline: false },
				{ name: '**__Active at least once a week__**', value: `${meetsTwo}  \`\`Last login at ${new Date(player.lastLogin).toString().slice(4, 15)}\`\``, inline: false },
				{ name: '**__Index score of 50+__**', value: `${meetsThree} \`\`${index.toFixed(2) ?? "0"}\`\``, inline: false },
			)
			.setFooter(bot.name);
		message.channel.send({ embeds: [reqEmbed] });
	}
}