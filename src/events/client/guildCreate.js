const { MessageEmbed } = require(`discord.js`)
const { bot, design: { colourScheme } } = require(`../../config.json`)
const chalk = require(`chalk`)

module.exports = (client, guild) => {
	console.log(chalk`{ > Joined [${guild?.name}] adding [${guild?.memberCount}] more users!}`)

	const channel = guild?.channels.cache.find(channel => channel?.type === 'GUILD_TEXT' && channel.permissionsFor(guild.me).has('SEND_MESSAGES'))
	if (!channel) return;

	const firstMessage = new MessageEmbed()
		.setColor(colourScheme.default)
		.setTitle(`Thanks for inviting ${bot.name}!`)
		.setDescription(`Use \`${bot.defaultPrefix}help\` to get started!`);

	channel.send({ embeds: [firstMessage] })
		.then(m => { setTimeout(() => m.delete(), 10000) }).catch(e => { })
}