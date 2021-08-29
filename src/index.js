require('dotenv').config()
const { Client, Intents } = require('discord.js');
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_MEMBERS] });
["process", "commandHandler", "eventHandler"].forEach(handler => {
	require(`./handlers/${handler}`)(client)
})
client.login(process.env.DISCORD_BOT_TOKEN);