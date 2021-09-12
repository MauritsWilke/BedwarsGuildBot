const Command = require(`../../utils/command`)
const { MessageEmbed, MessageAttachment, MessageActionRow, MessageSelectMenu } = require(`discord.js`)
const { getSkin } = require(`../../utils/api/mojang`)
const { createCanvas, loadImage, Image } = require('canvas')
const config = require(`../../config.json`)

module.exports = class extends Command {
	constructor() {
		super({
			name: "profilePicture",
			description: "Generate a Minecraft profile picture!\nWarning: Results may vary 😉",
			aliases: [
				"pfp",
			],
			category: "fun",
			usage: "pfp [username] (hex bottom) (hex top)",
			example: "pfp de_grote #99DAAC #88eddB",
			settings: {
				"locked": false,
				"cooldown": 10000,
				"perms": [
					"SEND_MESSAGES",
					"ATTACH_FILES"
				],
			}
		})
	}

	/**
	 * Params for command
	 * @param {object} message - The message of the user
	 * @param {string[]} args - The arguments of the message, does not include command
	 * @param {object} client - The client itself
	*/
	async run(message, args, client) {
		const canvas = createCanvas(320, 320);
		const ctx = canvas.getContext("2d");
		ctx.scale(16, 16)
		ctx.imageSmoothingEnabled = false;

		let selectedCosmetics = [];
		const skinURL = await getSkin(args[0]);
		const playerSkin = await loadImage(skinURL);
		const purpleShadingImage = await loadImage(`src/images/profilePicture/20x20pshading.png`);
		const backdropShading = await loadImage(`src/images/profilePicture/backdropshading.png`)

		// _ CUSTOM GRADIENT
		if (args[1] && args[2]) {
			if (!args[1].match(/^[#0-9A-F]+$/i) || !args[2].match(/^[#0-9A-F]+$/i)) {
				const errorEmbed = new MessageEmbed()
					.setColor(config.colours.error)
					.setDescription(`Invalid hex code!\nCheck [hex generator](https://www.color-hex.com/color-wheel/) to generate a valid hex`)
					.setThumbnail(config.images.error)
					.setTimestamp()
					.setFooter(config.name);
				return message.channel.send({ embeds: [errorEmbed] });
			}

			let gradient = ctx.createLinearGradient(0, 20, 0, 0);
			const hex1 = args[1].slice(0, 1) == '#' ? args[1] : `#${args[1]}`
			const hex2 = args[2].slice(0, 1) == '#' ? args[2] : `#${args[2]}`
			gradient.addColorStop(1, hex2)
			gradient.addColorStop(0, hex1)
			ctx.fillStyle = gradient;
			ctx.fillRect(0, 0, 20, 20);

		} else {
			// * DEFAULT GRADIENT
			let gradient = ctx.createLinearGradient(0, 15, 0, 0);
			gradient.addColorStop(1, "#00cdac");
			gradient.addColorStop(0, "#02aab0");
			ctx.fillStyle = gradient;
			ctx.fillRect(0, 0, 20, 20);
		}

		// _ Backdrop Shading
		args[4] == "false" ? null : ctx.drawImage(backdropShading, 0, 0, 20, 20);

		// _ Drawing PLayer Skin (dont fucking touch this)
		if (playerSkin.height === 32) {
			ctx.drawImage(playerSkin, 8, 9, 7, 7, 8, 4, 7, 7); // Head (bottom layer)
			ctx.drawImage(playerSkin, 5, 9, 3, 7, 5, 4, 3, 7); // Head Side (bottom layer)
			ctx.drawImage(playerSkin, 44, 20, 3, 7, 12, 13, 3, 7); // Arm Right Side (bottom layer)
			ctx.drawImage(playerSkin, 21, 20, 6, 1, 7, 11, 6, 1); // Chest Neck Small Line (bottom layer)
			ctx.drawImage(playerSkin, 20, 21, 8, 8, 6, 12, 8, 8); // Chest Other (Bottom layer)
			ctx.drawImage(playerSkin, 44, 20, 3, 7, 5, 13, 3, 7); // Arm Left Side (bottom layer)
			ctx.drawImage(playerSkin, 40, 9, 7, 7, 8, 4, 7, 7); // Head (top layer)
			ctx.drawImage(playerSkin, 33, 9, 3, 7, 5, 4, 3, 7); // Head Side (top layer)

		} else {
			// * BOTTOM LAYER
			ctx.drawImage(playerSkin, 8, 9, 7, 7, 8, 4, 7, 7); // Head (bottom layer)
			ctx.drawImage(playerSkin, 5, 9, 3, 7, 5, 4, 3, 7); // Head Side (bottom layer)
			ctx.drawImage(playerSkin, 36, 52, 3, 7, 12, 13, 3, 7); // Arm Right Side (bottom layer)
			ctx.drawImage(playerSkin, 21, 20, 6, 1, 7, 11, 6, 1); // Chest Neck Small Line (bottom layer)
			ctx.drawImage(playerSkin, 20, 21, 8, 8, 6, 12, 8, 8); // Chest Other (Bottom layer)
			ctx.drawImage(playerSkin, 44, 20, 3, 7, 5, 13, 3, 7); // Arm Left Side (bottom layer)

			// * TOP LAYER
			ctx.drawImage(playerSkin, 40, 9, 7, 7, 8, 4, 7, 7); // Head (top layer)
			ctx.drawImage(playerSkin, 33, 9, 3, 7, 5, 4, 3, 7); // Head Side (top layer)
			ctx.drawImage(playerSkin, 52, 52, 3, 7, 12, 13, 3, 7); // Arm Right Side (top layer)
			ctx.drawImage(playerSkin, 52, 36, 3, 7, 5, 13, 3, 7); // Arm Left Side (top layer)
			ctx.drawImage(playerSkin, 20, 37, 8, 8, 6, 12, 8, 8); // Chest Other (top layer)
			ctx.drawImage(playerSkin, 21, 36, 6, 1, 7, 11, 6, 1); // Chest Neck Small Line (top layer)
		}

		// _ ADDING SHADING
		args[3] == "false" ? null : ctx.drawImage(purpleShadingImage, 0, 0, 20, 20);

		const attachment = new MessageAttachment(canvas.toBuffer(), 'profilePicture.png')
		const secondCanvas = createCanvas(canvas.width, canvas.height)

		//_ Clone the first canvas for later resets
		const secCtx = secondCanvas.getContext(`2d`)
		secCtx.scale(16, 16)
		secCtx.imageSmoothingEnabled = false;
		secCtx.drawImage(canvas, 0, 0, 20, 20)

		// _ COSMETICS MENU
		const row = new MessageActionRow()
			.addComponents(
				new MessageSelectMenu()
					.setCustomId('cosmeticSelect')
					.setPlaceholder('Add cosmetics! (optional)')
					.addOptions(setCosmeticOptions(selectedCosmetics)),
			);

		const sendMessage = await message.channel.send({ files: [attachment], components: [row] })
		const collector = sendMessage.createMessageComponentCollector({ time: 60000 })

		collector.on(`collect`, async selection => {
			if (selection.user.id !== message.author.id) return selection.reply({ content: "Only the executer of the command can use this!", ephemeral: true });

			ctx.drawImage(secondCanvas, 0, 0, 20, 20)
			const cosmeticAttachment = new MessageAttachment(canvas.toBuffer(), 'profilePicture.png')

			if (selection.values[0] == `reset`) {
				selectedCosmetics = []
				const row = new MessageActionRow()
					.addComponents(
						new MessageSelectMenu()
							.setCustomId('cosmeticSelect')
							.setPlaceholder('Add cosmetics! (optional)')
							.addOptions(setCosmeticOptions(selectedCosmetics)),
					);
				return await selection.update({ files: [cosmeticAttachment], attachments: [], content: `\u200B`, components: [row] });
			}

			if (selectedCosmetics.includes(selection.values[0])) {
				selectedCosmetics = selectedCosmetics.filter(v => v != selection.values[0])
			} else {
				selectedCosmetics.push(selection.values[0]);
			}

			const row = new MessageActionRow()
				.addComponents(
					new MessageSelectMenu()
						.setCustomId('cosmeticSelect')
						.setPlaceholder('Add cosmetics! (optional)')
						.addOptions(setCosmeticOptions(selectedCosmetics)),
				);

			let drawnCosmetics = 0;
			if (selectedCosmetics.length == 0) return sendUpdatedCanvas()
			selectedCosmetics.forEach(async (selCos) => {
				if (selCos !== "greyscale") {
					const cosmetic = await loadImage(`src/images/profilePicture/${selCos}.png`)
					ctx.drawImage(cosmetic, 0, 0, 20, 20);
				}
				drawnCosmetics++
				if (drawnCosmetics === selectedCosmetics.length) {
					if (selectedCosmetics.includes("greyscale")) canvasToGreyscale(canvas, ctx)
					sendUpdatedCanvas()
				}
			})

			async function sendUpdatedCanvas() {
				const cosmeticAttachment = new MessageAttachment(canvas.toBuffer(), 'profilePicture.png')
				return await selection.update({ files: [cosmeticAttachment], attachments: [], content: `\u200B`, components: [row] })
			}
		})

		collector.on(`end`, () => {
			sendMessage.edit({ components: [] })
		})
	}
}

/**
 * Sets the correct options for the arrays (Remove)
 * @param {array} selectedCosmetics 
 * @returns {array} cosmeticOptions
 */
function setCosmeticOptions(selectedCosmetics) {
	cosmeticOptions = [
		{
			label: `${selectedCosmetics.includes("monocle") ? "Remove" : ""} Monocle`,
			description: 'Where is my top hat, Albert?',
			value: 'monocle',
			emoji: {
				id: null,
				name: `${selectedCosmetics.includes("monocle") ? "❌" : "🧐"}`
			}
		},
		{
			label: `${selectedCosmetics.includes("christmasHat") ? "Remove" : ""} Christmas Hat`,
			description: 'Ho Ho Ho never too early!',
			value: 'christmasHat',
			emoji: {
				id: null,
				name: `${selectedCosmetics.includes("christmasHat") ? "❌" : "🎄"}`
			}
		},
		{
			label: `${selectedCosmetics.includes("snow") ? "Remove" : ""} Snow! ⛄`,
			description: `Let it snow, let it snow, let it snow!`,
			value: `snow`,
			emoji: {
				id: null,
				name: `${selectedCosmetics.includes("snow") ? "❌" : "❄"}`
			}
		},
		{
			label: `${selectedCosmetics.includes("catears") ? "Remove" : ""} Cat Ears`,
			description: `Meow`,
			value: `catears`,
			emoji: {
				id: null,
				name: `${selectedCosmetics.includes("catears") ? "❌" : "😺"}`
			}
		},
		{
			label: `${selectedCosmetics.includes("sunglasses") ? "Remove" : ""} Sunglasses!`,
			description: `Lookin extra cool today `,
			value: `sunglasses`,
			emoji: {
				id: null,
				name: `${selectedCosmetics.includes("sunglasses") ? "❌" : "🕶"}`
			}
		},
		{
			label: `${selectedCosmetics.includes("cape") ? "Remove" : ""} Cape!`,
			description: `Coming to save the day! `,
			value: `cape`,
			emoji: {
				id: null,
				name: `${selectedCosmetics.includes("cape") ? "❌" : "🦸‍♂️"}`
			}
		},
		{
			label: ` ${selectedCosmetics.includes("crown") ? "Remove" : ""} Crown`,
			description: `King of Minecraft `,
			value: `crown`,
			emoji: {
				id: null,
				name: `${selectedCosmetics.includes("crown") ? "❌" : "👑"}`
			}
		},
		{
			label: `${selectedCosmetics.includes("ilikecats") ? "Remove" : ""} I_Like_Cats__`,
			description: `Just become I_Like_cats__ `,
			value: `ilikecats`,
			emoji: {
				id: selectedCosmetics.includes("ilikecats") ? null : "876553118542860288",
				name: `${selectedCosmetics.includes("ilikecats") ? "❌" : "slapping_cats"}`,
				animated: selectedCosmetics.includes("ilikecats") ? false : true
			}
		},
		{
			label: `${selectedCosmetics.includes("trident") ? "Remove" : ""} Trident!`,
			description: `Like Poseidon!`,
			value: `trident`,
			emoji: {
				id: null,
				name: `${selectedCosmetics.includes("trident") ? "❌" : "🔱"}`
			}
		},
		{
			label: `${selectedCosmetics.includes("tophat") ? "Remove" : ""} Top hat`,
			description: `Found the top hat, Albert `,
			value: `tophat`,
			emoji: {
				id: null,
				name: `${selectedCosmetics.includes("tophat") ? "❌" : "🎩"}`
			}
		},
		{
			label: `${selectedCosmetics.includes("greyscale") ? "Remove" : ""} Greyscale filter!`,
			description: `Colours are too OP `,
			value: `greyscale`,
			emoji: {
				id: null,
				name: `${selectedCosmetics.includes("greyscale") ? "❌" : "⬛"}`
			}
		},
		{
			label: `Reset`,
			description: `Reset to default`,
			value: `reset`,
			emoji: {
				id: null,
				name: `❌`
			}
		},
	]
	return cosmeticOptions
}

/**
 * Convert canvas to grey 
 * @param {object} canvas - The canvas to convert to greyscale
 * @param {object} ctx - The context of the canvas
 * @returns {object} canvas
 */
function canvasToGreyscale(canvas, ctx) {
	let imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
	let dataArray = imageData.data;
	for (let i = 0; i < dataArray.length; i += 4) {
		let red = dataArray[i];
		let green = dataArray[i + 1];
		let blue = dataArray[i + 2];
		let alpha = dataArray[i + 3];

		let gray = (red + green + blue) / 3;

		dataArray[i] = gray;
		dataArray[i + 1] = gray;
		dataArray[i + 2] = gray;
		dataArray[i + 3] = alpha; // not changing the transparency
	}

	ctx.putImageData(imageData, 0, 0);
	return canvas
}