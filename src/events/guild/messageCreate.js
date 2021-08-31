const { Collection, MessageEmbed } = require("discord.js")
const { getDevID } = require("../../utils/utils")
const { bot: { defaultPrefix, name }, devs, design: { colourScheme } } = require('../../config.json')
const { commandLocked } = require(`../../utils/templates/embedTemplates`)

const cooldowns = new Map();

module.exports = async (client, message) => {
	if (message.channel.type !== "GUILD_TEXT") return;
	if (!message.content.startsWith(defaultPrefix) || message.author.bot) return;

	const args = message.content.slice(defaultPrefix.length).split(/ +/);
	const commandName = args.shift().toLowerCase();

	const command = client.commands.get(commandName) ||
		client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));
	if (!command) return;
	const { settings } = command;

	if (!getDevID(devs).includes(message.author.id)) {
		if (!cooldowns.has(commandName)) {
			cooldowns.set(commandName, new Collection())
		}
		const currentTime = Date.now();
		const timestamps = cooldowns.get(commandName);
		const cooldownAmount = command.settings?.cooldown;
		if (timestamps.has(message.author.id)) {
			const expiration = timestamps.get(message.author.id) + cooldownAmount;

			if (currentTime < expiration) {
				const timeleft = (expiration - currentTime) / 1000

				return message.channel.send(`This command is currently on cooldown for \`\`${timeleft.toFixed(1)}\`\` more second(s).`)
			}
		}
		timestamps.set(message.author.id, currentTime);
		setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);
	}

	if (settings?.locked) {
		if (getDevID(devs).includes(message.author.id)) {
			const msg = await message.reply({ embeds: [commandLocked] })
			msg.react(`✅`).then(() => msg.react(`❌`))

			const filter = (reaction, user) => {
				return ['✅', `❌`].includes(reaction.emoji.name) && user.id === message.author.id;
			};

			msg.awaitReactions({ filter, max: 1, time: 10000, errors: [`time`] })
				.then(collected => {
					const reaction = collected.first();

					if (reaction.emoji.name === `✅`) {
						command.run(message, args, client)
					}

					msg.delete()
				})
			return
		}
		return message.reply("This command is disabled, sorry");
	}
	if (settings?.devOnly && !getDevID(devs).includes(message.author.id)) return message.reply("This command is exclusive to our dev team, sorry");

	let missingPerms = []
	settings?.perms.forEach((perm) => {
		if (!message.guild.me.permissions.has(perm)
			&& !message.channel.permissionsFor(message.guild.me).has(perm)) missingPerms.push(perm)
	})
	if (missingPerms.length > 0) {
		if (missingPerms.includes("EMBED_LINKS")) return message.channel.send(`The bot is missing permissions: \`${missingPerms.join(",")}\`\nPlease enable these before contacting the dev team`)
		const embed = new MessageEmbed()
			.setColor(colourScheme.error)
			.setTitle(`Missing Permissions :(`)
			.setDescription(`The bot is missing permissions for:\n${missingPerms.join(", ")}\nPlease enable these before contacting the dev team`)
			.setFooter(name, client.user.displayAvatarURL())
		return message.channel.send({ embeds: [embed] })
	}

	command.run(message, args, client)
}