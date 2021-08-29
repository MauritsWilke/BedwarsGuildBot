const Discord = require("discord.js")
const fs = require('fs');

module.exports = (client) => {
	const loadDir = (dirs) => {
		const eventFiles = fs.readdirSync(`./src/events/${dirs}`).filter(file => file.endsWith('.js'));

		for (const file of eventFiles) {
			const event = require(`../events/${dirs}/${file}`);
			const eventName = file.split('.')[0];
			client.on(eventName, event.bind(null, client))
		}
	}
	['client', 'guild'].forEach(dir => loadDir(dir));
}