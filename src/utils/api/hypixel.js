require('dotenv').config()
const fetch = require('node-fetch');
const { getUUID, getUsername } = require('./mojang.js');

const BASE_KEY = "https://api.hypixel.net"

let uuidCache = {};
let flCache = {};
let playerGuildCache = {};

module.exports = {
	keyInfo,
	playerStats,
	friendList,
	recentGames,
	playerStatus,
	playerGuild,
	guildData,
	getActiveBoosters,
	playerCounts,
	getPunishments,
	clearCache
}

async function keyInfo() {
	const response = await fetch(`${BASE_KEY}/key?&key=${process.env.HYPIXEL_API_KEY}`);
	if (!response.ok) return Promise.reject(`${response.status} ${response.statusText}`);
	const r = await response.json();
	return r.record;
}

async function playerStats(player, gamemode) {
	if (!player) return Promise.reject(`This function requires an input`);
	const UUID = await checkUUIDCache(player);
	const response = await fetch(`${BASE_KEY}/player?uuid=${UUID}&key=${process.env.HYPIXEL_API_KEY}`);
	if (!response.ok) return Promise.reject(`${response.status} ${response.statusText}`);
	const json = await response.json();
	return gamemode ? json.player.stats[gamemode] : json.player;
}

function friendList(player) {
	if (!player) return Promise.reject(`This function requires an input`);
	return flCache[player] ? flCache[player] : getFriendList(player);
}

async function recentGames(player) {
	if (!player) return Promise.reject(`This function requires an input`);
	const UUID = await checkUUIDCache(player);
	const response = await fetch(`${BASE_KEY}/recentgames?uuid=${UUID}&key=${process.env.HYPIXEL_API_KEY}`);
	const r = await response.json();
	return r.games;
}

async function playerStatus(player) {
	if (!player) return Promise.reject(`This function requires an input`);
	const UUID = await checkUUIDCache(player);
	const response = await fetch(`${BASE_KEY}/status?uuid=${UUID}&key=${process.env.HYPIXEL_API_KEY}`);
	if (!response.ok) return Promise.reject(`${response.status} ${response.statusText}`);
	const json = await response.json();
	return json.session.online;
}

function playerGuild(player) {
	if (!player) return Promise.reject(`This function requires an input`);
	return playerGuildCache[player] ? playerGuildCache[player] : getPlayerGuild(player);
}

async function guildData(guildName) {
	if (!guildName) return Promise.reject(`This function requires an input`);
	const response = await fetch(`${BASE_KEY}/guild?name=${guildName}&key=${process.env.HYPIXEL_API_KEY}`);
	if (!response.ok) return Promise.reject(`${response.status} ${response.statusText}`);
	const json = await response.json();
	return json.guild;
}

async function getActiveBoosters() {
	activeBoosters = {};
	const response = await fetch(`${BASE_KEY}/boosters?&key=${process.env.HYPIXEL_API_KEY}`);
	if (!response.ok) return Promise.reject(`${response.status} ${response.statusText}`);
	const json = await response.json();
	const boosters = json.boosters;
	for (const boost in boosters) {
		boosters[boost].length < 3600 ? activeBoosters[boost] = boosters[boost] : null;
	}
	return activeBoosters;
}

async function playerCounts() {
	playerCount = new Map();
	const response = await fetch(`${BASE_KEY}/counts?&key=${process.env.HYPIXEL_API_KEY}`);
	if (!response.ok) return Promise.reject(`${response.status} ${response.statusText}`);
	const json = await response.json();
	const games = json.games;
	playerCount.set("TOTAL", json.playerCount)
	for (const game in games) {
		playerCount.set(game, games[game].players);
	}
	return playerCount;
}

async function getPunishments() {
	const response = await fetch(`${BASE_KEY}/punishmentstats?&key=${process.env.HYPIXEL_API_KEY}`);
	if (!response.ok) return Promise.reject(`${response.status} ${response.statusText}`);
	const json = await response.json();
	return json;
}

async function clearCache() {
	uuidCache = {};
	flCache = {};
	playerGuildCache = {};
}

// 
// Functions that shouldn't be exported
// 

async function getFriendList(player) {
	let friendList = new Map()
	const UUID = await checkUUIDCache(player);
	console.log(UUID);
	const response = await fetch(`${BASE_KEY}/friends?uuid=${UUID}&key=${process.env.HYPIXEL_API_KEY}`);
	if (!response.ok) return Promise.reject(`${response.status} ${response.statusText}`);
	const { records } = await response.json();

	for (const friend of records) {
		friendList.set(friend.uuidReceiver === UUID ? await getUsername(friend.uuidSender) : await getUsername(friend.uuidReceiver), Intl.DateTimeFormat('en-GB').format(new Date(friend.started)))
	}
	flCache[player] = friendList;
	setTimeout(() => { delete flCache[player] }, 600000)
	return friendList;
}

async function getPlayerGuild(player) {
	const UUID = await checkUUIDCache(player);
	const response = await fetch(`${BASE_KEY}/guild?player=${UUID}&key=${process.env.HYPIXEL_API_KEY}`);
	if (!response.ok) return Promise.reject(`${response.status} ${response.statusText}`);
	const json = await response.json();
	playerGuildCache[player] = json.guild.name;
	setTimeout(() => { delete playerGuildCache[player] }, 600000)
	return json.guild.name;
}

async function checkUUIDCache(player) {
	let UUID = uuidCache[player] || await getUUID(player).then(r => {
		uuidCache[player] = r;
		setTimeout(() => { delete uuidCache[player] }, 15 * 60000)
		return r;
	});
	return UUID;
}