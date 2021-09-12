process.stdin.resume();
const Discord = require('discord.js')
const config = require(`../config.json`)
const chalk = require(`chalk`)

module.exports = (client) => {

	process.on('exit', (code) => {
		console.log(chalk`{bold.red ${config.design.char.error} Client shutting down with code:}`, `${code}`);

		// const newEmbed = new Discord.MessageEmbed()
		// 	.setColor(config.design.colourScheme.error)
		// 	.setTitle("Unexpected Exit ❗")
		// 	.addField("\u200B", code ?? "-")
		// 	.setTimestamp()
		// 	.setFooter(config.bot.name);
		// (async () => {
		// 	const user = await client.users.fetch(config.devs[0].DiscordID);
		// 	if (user) user.send(newEmbed)
		// })()
	});

	process.on('uncaughtException', async (err, origin) => {
		console.log(chalk`{bold.red ${config.design.char.error} Origin:}`, `${err.stack}`);
		console.log(chalk`{bold.red ${config.design.char.error} Error:}`, `${err}`);

		// const newEmbed = new Discord.MessageEmbed()
		// 	.setColor(config.design.colourScheme.error)
		// 	.setTitle("Unsuspected Error ❗")
		// 	.addField(err.stack.toString() || "-", err.toString() || "-")
		// 	.setTimestamp()
		// 	.setFooter(config.bot.name);
		// (async () => {
		// 	const user = await client.users.fetch(config.devs[0].DiscordID).catch(e => { });
		// 	if (user) user.send(newEmbed)
		// })()
	});

	process.on('warning', (warning) => {
		console.log(chalk`{magenta ${config.design.char.warning} Warning: }`, warning.message);

		const errorChannel = client.channels.cache.last()
		errorChannel.send("Something went wrong bitch")
		// const newEmbed = new Discord.MessageEmbed()
		// 	.setColor(config.design.colourScheme.error)
		// 	.setTitle("Warning ⚠")
		// 	.addField("\u200B", warning ?? "-")
		// 	.setTimestamp()
		// 	.setFooter(config.bot.name);
		// (async () => {
		// 	const user = await client.users.fetch(config.devs[0].DiscordID);
		// 	if (user) user.send(newEmbed)
		// })()
	})
}