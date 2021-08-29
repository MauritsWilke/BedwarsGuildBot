module.exports = class {

	/**
	 * Default command template
	 * @param {Object} config - The command configuration
	 * @param {string} config.name - The name of the command
	 * @param {string} config.description - The description of the command
	 * @param {array} config.aliases - The aliases of the bot
	 * @param {string} config.category - The command category
	 * @param {string} config.usage - The command usage
	 * @param {string} config.example - An example of the command
	 * @param {object} config.settings - The settings of the command
	 * @param {boolean} config.settings.locked - Command locked 
	 * @param {boolean} config.settings.devOnly - Command limited to devs
	 * @param {number} config.settings.cooldown - Command cooldown (ms)
	 * @param {array} config.settings.args - The arguments for the command
	 * @param {array} config.settings.perms - Needed permissons for execution {@link https://discord.js.org/#/docs/main/stable/class/Permissions?scrollTo=s-FLAGS Flags}
	 */
	constructor(config) {
		config = {
			name: "",
			description: "",
			aliases: null,
			category: "other",
			usage: "",
			example: "",
			settings: {
				"locked": false,
				"devOnly": false,
				"cooldown": 0,
				"args": null,
				"perms": null,
			},
			...config
		}

		Object.assign(this, config)
		this.name = this.name.toLowerCase()
		this.aliases = this.aliases?.map(a => a.toLowerCase())
	}
}