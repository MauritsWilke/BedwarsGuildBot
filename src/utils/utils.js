module.exports = {
	getDevID,
}

function getDevID(devs) {
	let devIDs = []
	for (dev of devs) {
		devIDs.push(dev.DiscordID)
	}
	return devIDs
}