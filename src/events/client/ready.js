const config = require(`../../config.json`)
const chalk = require('chalk')
const { bot: { defaultPrefix } } = require(`../../config.json`)

module.exports = (client) => {
	client.user.setPresence({
		activities: [{
			name: defaultPrefix,
			type: "LISTENING"
		}],
		status: 'online'
	});
	console.log(" ")
	console.log(chalk`{cyanBright ${config.bot.name} is online running v${config.bot.version}}`)
	console.log(" ")
}