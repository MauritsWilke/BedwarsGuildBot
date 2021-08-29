const config = require(`../../config.json`)
const chalk = require('chalk')

module.exports = (client) => {
	client.user.setPresence({
		activities: [{
			name: '!',
			type: "LISTENING"
		}],
		status: 'online'
	});
	console.log(" ")
	console.log(chalk`{cyanBright ${config.bot.name} is online running v${config.bot.version}}`)
	console.log(" ")
}