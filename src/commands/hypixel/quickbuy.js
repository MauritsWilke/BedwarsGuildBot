const Command = require(`../../utils/command`)
const { MessageAttachment, MessageEmbed } = require(`discord.js`)
const { createCanvas, loadImage } = require('canvas');
const { playerStats } = require(`../../utils/api/hypixel`)
const { bot, design: { colourScheme } } = require(`../../config.json`)

const canvas = createCanvas(348, 259);
const ctx = canvas.getContext('2d');

module.exports = class extends Command {
    constructor() {
        super({
            name: "quickbuy",
            description: "Get your Hypixel Bedwars quickbuy!",
            aliases: [
                "qb"
            ],
            category: "hypixel",
            usage: "quickbuy [username]",
            example: "quickbuy Purpled",
            settings: {
                "cooldown": 5000,
                "perms": [
                    "SEND_MESSAGES"
                ],
            }
        })
    }

    /**
     * Params for command
     * @param {string} message - The message of the user
     * @param {string[]} args - The arguments of the message, does not include command
     * @param {object} client - The client itself
    */
    async run(message, args, client) {
            const quickBuyBackground = await loadImage('src/images/quickbuy/empty.png');
            ctx.drawImage(quickBuyBackground, 0, 0, canvas.width, canvas.height)
    
            const player = await playerStats(args[0]);
    
            if(!player?.stats?.Bedwars?.favourites_2) throw new Error(`${args[0]} has not played bedwars or has not logged in since quickbuy was added`)
    
            const quickBuy = player?.stats?.Bedwars?.favourites_2.split(',')
            for(let item in quickBuy){
                const itemImage = await loadImage(`src/images/quickbuy/${quickBuy[item]}.png`)
                const leftCoord = 48 + (36 * item) - (Math.floor(item / 7) * (36*7));
                const topCoord = 104 + (Math.floor(item / 7) * 36);
                ctx.drawImage(itemImage, leftCoord, topCoord, 36, 36)
            }
    
            const attachment = new MessageAttachment(canvas.toBuffer(), 'quickBuy.png')
            const quickBuyEmbed = new MessageEmbed()
                .setColor(colourScheme.default)
                .setDescription("To change these items, join a game of Bedwars and shift click an item to add it to your quick buy!")
                .setTitle(`Quickbuy of ${player.displayname}`)
                .setImage(`attachment://quickBuy.png`)                

            message.channel.send({ embeds: [quickBuyEmbed], files: [attachment]})
    }
}