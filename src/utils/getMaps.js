const fetch = require(`node-fetch`);
const cheerio = require(`cheerio`);
const hyURL = new URL(`https://hypixel.net/threads/bed-wars-map-rotation-log.4441812/`);

/**
 * The last time the page was updated
 * @type {number}
 */
let lastEdit;
let lastEditRelative;
let sortedMapCache;
let allMapsCache;

let rotationMapsCache;

const mapTypes = [
	"8 Teams (Long & Tactical)",
	"8 Teams (Quick & Rushy)​",
	"4 Teams (Long & Tactical)",
	"4 Teams (Quick & Rushy)​"
]

/**
 * getText converts a webpage into HTML text
 * @param {string} URL - The URL of the page to convert to raw text
 * @returns {string}
 */
const getText = async (URL) => {
	const res = await fetch(URL, {
		method: `GET`,
		headers: {
			'Content-Type': 'text/html',
			'User-Agent': 'Mozilla/5.0 Firefox/91.0',
			'Forwarded': `by=${process.env.IP_ADDRESS}`
		}
	})
	const text = await res.text()
	console.log(text)
	return text
}

/**
 * 
 * @param {boolean} sorted - True for maps sorted by type
 * @returns {array} Maps
 */
const getCurrentMaps = async (sorted = false) => {
	if (Date.now() - lastEdit > 604800000) {
		return sorted ? sortedMapCache : allMapsCache;
	}


	const rawData = await getText(hyURL);
	const parsedData = cheerio.load(rawData);
	const lastEditedRaw = parsedData(`div.message-lastEdit`);
	lastEditRelative = lastEditedRaw.html().replace(/.*(data-time=\"\d*\").*/, "$1").replace(/\D/g, "")
	lastEdit = Date.now() - lastEditRelative;

	const maps = [[], [], [], []];
	const allMaps = [];
	parsedData(`div.bbWrapper:contains("Current Rotation") > div.bbTable > table > tbody > tr > td`).each((index, element) => {
		const mapName = parsedData(element).text().toLowerCase()
		maps[index % 4][maps[index % 4].length] = mapName;
		allMaps.push(mapName);
	})
	allMapsCache = allMaps;
	sortedMapCache = maps;

	return sorted ? sortedMapCache : allMapsCache;
};

function getLastEdit() {
	return lastEditRelative || "Unknown"
}

const getLatestRotation = async () => {
	if (Date.now() - lastEdit > 604800000) return rotationMapsCache;

	const rawData = await getText(hyURL);
	const parsedData = cheerio.load(rawData);

	let rotationMaps = [[], []]
	parsedData(`article:contains("Rotation Changes")`).last().find(`table > tbody > tr > td`).each((index, element) => {
		rotationMaps[index % 2][rotationMaps[index % 2].length] = parsedData(element).text()
	})
	rotationMapsCache = rotationMaps;
	return rotationMaps;
}

module.exports = {
	getCurrentMaps,
	getLastEdit,
	mapTypes,
	getLatestRotation
}

getCurrentMaps()
getLatestRotation()