# Bedwars Guild Bot

The official Bedwars Guild Bot  source code\
I decided to make the code open source so that anyone who is interested can see the inner workings and use pieces for their own projects.

Official Server: [Bedwars Guild Server](https://discord.gg/VmAQ6rpsHg)

## 💻 Developer

Made by Maurits Wilke
Discord: [The Almighty One#3365](https://discord.com/users/378874450105466880/) \
Portfolio site: [MauritsWilke.com](https://www.mauritswilke.com)

## 🔧 Setup 
To run the bot on your machine, open the terminal and run `npm run setup` \
This should run a setup program and install the necessary modules.

If this fails, follow these steps for manual setup:
1. Add a `.env` in the project folder. \
Copy paste the following into it: 
	```js
	DISCORD_BOT_TOKEN="<Your Bot Token>"
	HYPIXEL_API_KEY="<Your Hypixel API Key>"
	```
2. Run `npm i` to install all the node modules
3. To start the bot, type `node .`
## ℹ Info about the Bot
The bot is made with `NodeJS` using a vary of modules:
 - Canvas
 - Chalk
 - Discord.js
 - Cheerio (No longer in use at the moment)
 - Node-Fetch

The main purpose of the bot was to simplify things for the Bedwars Guild like checking someones index score or checking if they meet requirements, but since then it has advanced to more of an allround Minecraft bot

 - [x] Add QuickBuy
 - [ ] Better "Thanks for inviting" Message
 - [ ] Somehow bypass CloudFlare for the Map Rotations
 - [ ] Minecraft Chat Rendering
 - [ ] MOTD Generating
 - [ ] Skin checking
 - [ ] Name checking

Suggestions are always welcome!

### ◼ Footnote

If you find any tokens/keys in the files, please notify me :)
