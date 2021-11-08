const { Cache } = require(`@mauritswilke/toolbox`)
const fetch = require("node-fetch")

const uuidCache = new Cache(15 * 60000)
const skinCache = new Cache(15 * 60000)

/**
 * Retrieves the UUID of a player.
 * @async
 * @param {string} username 
 * @returns {Promise<string>} UUID
 * @example 
 * // Returns a string similair to "11456473de284d36aa7b4150fe7859ab"
 * const playerUUID = await getUUID("I_Like_Cats__");
 */
async function getUUID(username) {
	if (!username) return Promise.reject(`This function requires an input`)
	if (!validUsername(username)) return Promise.reject(`${username} is an invalid username`)
	if (uuidCache.get(username)) return uuidCache.get(username)
	const response = await fetch(`https://api.mojang.com/users/profiles/minecraft/${username}`)
	if (response.status !== 200) return Promise.reject(`${username} does not exist`);
	const json = await response.json();
	uuidCache.set(username, json.id)
	return json.id
}

/**
 * Retrieves the skin of a player.
 * @async
 * @param {string} username 
 * @returns {Promise<string>} URL of the player skin
 * @example 
 * // Returns a URL similair to "http://textures.minecraft.net/texture/8893479f1b0bc4fffe7428a66f5b4dd105003e70b5de5885b885d13814f35337"
 * const playerSkin = await getSkin("I_Like_Cats__");
 */
async function getSkin(username) {
	if (!username) return Promise.reject(`This function requires an input`)
	if (!validUsername(username)) return Promise.reject(`${username} is an invalid username`)
	if (skinCache.get(username)) return skinCache.get(username)
	const UUID = await getUUID(username)
	const response = await fetch(`https://sessionserver.mojang.com/session/minecraft/profile/${UUID}`);
	if (response.status !== 200) return Promise.reject(`API Outage`);
	const json = await response.json();
	const r = JSON.parse(Buffer.from(json.properties[0].value, 'base64').toString('ascii'));
	skinCache.set(username, r.textures.SKIN.url)
	return r.textures.SKIN.url
}

/**
 * Retrieves the username of a player.
 * @async
 * @param {string} playerUUID 
 * @returns {Promise<string>} Current username of the requested UUID
 * @example 
 * // Returns "I_Like_Cats__" 
 * const playerUsername = await getUsername("11456473de284d36aa7b4150fe7859ab");
 */
async function getUsername(playerUUID) {
	if (!playerUUID) return Promise.reject(`This function requires an input`);
	if (!validUUID(playerUUID)) return Promise.reject(`Please submit a valid UUID`);
	const response = await fetch(`https://api.mojang.com/user/profiles/${playerUUID}/names`);
	if (response.status !== 200) return Promise.reject(`API Outage`);
	const json = await response.json();
	return json[json.length - 1].name;
}

/**
 * Retrieves the name history of a player.
 * Takes both UUID and Username.
 * @async
 * @param {string} player
 * @param {booleans} [timestamps=true] If set to false, the timestamps get converted to text
 * @returns {Promise<Map<string, string|boolean>} 'Username' => 'Changed at'
 * @example 
 * // Returns "Map(1) { 'I_Like_Cats__' => 'Original name' }" 
 * const nameHistory = await getNameHistory("11456473de284d36aa7b4150fe7859ab");
 */
async function getNameHistory(player, timestamps = true) {
	if (!player) return Promise.reject(`This function requires an input`);
	let nameHistory = new Map();

	if (player.length <= 16) {
		if (!validUsername(player)) return Promise.reject(`${player} is an invalid username`);
		player = await getUUID(player);
	} else if (!validUUID(player)) return Promise.reject(`Please submit a valid UUID`);

	const response = await fetch(`https://api.mojang.com/user/profiles/${player}/names`);
	if (!response.ok) return Promise.reject(`API Outage`);
	const r = await response.json();
	r.forEach(element => nameHistory.set(element.name, element.changedToAt ? timestamps ? element.changedToAt : Intl.DateTimeFormat('en-GB').format(new Date(element.changedToAt)) : "Original Name"));
	return nameHistory;
}

/**
 * Retrieve the current Optifine cape of a player
 * @async
 * @param {string} username Username of the player
 * @returns {Promise<string>|null} URL of the cape *OR* if no cape, NULL
 * @example 
 * // Returns "http://s.optifine.net/capes/I_Like_Cats__.png"
 * const cape = await getOptifineCape("I_Like_Cats__");
 */
async function getOptifineCape(username) {
	if (!username) return Promise.reject(`This function requires an input`);
	if (!validUsername(username)) return Promise.reject(`${username} is an invalid username`);
	const response = await fetch(`http://s.optifine.net/capes/${username}.png`)
	if (response.status === 404) return null;
	return response.url
}

/**
 * Clear the cache
 * @param {boolean} [uuid=true] Clear the cache of the UUID 
 * @param {boolean} [skin=true] Clear the cache of the skins 
 */
function clearCache(uuid = true, skin = true) {
	if (uuid) uuidCache.clear()
	if (skin) skinCache.clear()
}

/**
 * @param {string} username The username to check 
 * @returns {boolean} Returns true if a username is valid
 */
function validUsername(username) {
	return username.match(/^[a-z0-9_]*$/i)
}

/**
 * @param {string} uuid The UUID to check
 * @returns {boolean} Returns true if a username is valid
 */
function validUUID(uuid) {
	return uuid.match(/[\d-]/i)
}

module.exports = {
	getUUID,
	getSkin,
	getUsername,
	getNameHistory,
	getOptifineCape,
	clearCache
}