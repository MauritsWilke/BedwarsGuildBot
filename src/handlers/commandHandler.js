const { Collection } = require(`discord.js`)
const fs = require('fs');
const { resolve } = require("path");

module.exports = (client) => {
	client.commands = new Collection()

	const commandFolders = fs.readdirSync(`./src/commands`)

	for (const folder of commandFolders) {
		const commandFiles = fs.readdirSync(`./src/commands/${folder}`).filter(file => file.endsWith('.js'))
		for (const files of commandFiles) {
			const commandTemplate = require(resolve(`./src/commands/${folder}/${files}`));
			const command = new commandTemplate
			client.commands.set(command.name, command)
			delete require.cache[resolve(`./src/commands/${folder}/${files}`)]
		}
	}
}