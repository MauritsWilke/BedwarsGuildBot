const chalk = require('chalk')

let rateLimitcount = 0;

module.exports = () => {
	rateLimitcount++;
	console.warn(chalk`{yellowBright ⚠ Warning, rate limit reached [${rateLimitcount}]}`)
}