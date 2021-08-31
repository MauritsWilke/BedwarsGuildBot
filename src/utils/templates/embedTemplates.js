const { design, bot } = require(`../../config.json`)

exports.commandLocked = {
	color: design.colourScheme.default,
	title: `This command is currently locked`,
	description: `You can bypass this by reacting with ✅ \nDev team perks :stuck_out_tongue:`,
	timestamp: new Date(),
	footer: {
		text: bot.name,
	},
}
