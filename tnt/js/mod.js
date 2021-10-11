let modInfo = {
	name: "The Null Tree",
	id: "null_tree",
	author: "vgakbzc",
	pointsName: "null points",
	modFiles: ["layers/p.js", "layers/inf.js", "layers/au.js", "layers/c.js", "layers/a.js", "layers/f.js", "layers/e.js", "layers/w.js", "layers/ac.js", "layers/id.js", "tree.js", "layers/s.js"],

	discordName: "The Null Tree Discord",
	discordLink: "https://discord.gg/jtDquFCJEJ",
	initialStartPoints: new Decimal (0), // Used for hard resets and new players
	offlineLimit() {
		return 1
	},  // In hours
}

// Set your version in num and name
let VERSION = {
	num: "0.0.10",
	name: "I HATE Bugs",
}

let changelog = `<h1>Sorry i do not use this</h1>`

let winText = `Congratulations! You have reached the end and beaten this game and wasted ur time, but for now...`

// If you add new functions anywhere inside of a layer, and those functions have an effect when called, add them here.
// (The ones here are examples, all official functions are already taken care of)
var doNotCallTheseFunctionsEveryTick = ["blowUpEverything", "tryBuyMax"]

function getStartPoints(){
    return new Decimal(modInfo.initialStartPoints)
}

// Determines if it should show points/sec
function canGenPoints(){
	return hasUpgrade('c', 11)
}

// Calculate points/sec!
function getPointGen() {
	if(!canGenPoints())
		return new Decimal(0)

	let gain = new Decimal(1)
	if(hasUpgrade('c', 12)) gain = gain.times(upgradeEffect("c", 12));
	if(hasUpgrade('c', 13)) gain = gain.times(upgradeEffect("c", 13));
	if(hasUpgrade('c', 33)) gain = gain.times(upgradeEffect("c", 33));
	if(hasUpgrade('c', 42)) gain = gain.times(upgradeEffect("c", 42));
	gain = gain.mul(player["ac"].points.mul(0.01).sub(1).mul(buyableEffect("w", 11)).add(1))
	gain = gain.mul(buyableEffect("id",11))
	if(player.points.lt(16)) gain = gain.mul((new Decimal(68)).div(player.points.add(1)).sub(3).pow(0.5).abs())
	if(hasUpgrade("inf", 41)) gain = gain.mul(upgradeEffect("inf", 41))
	if(hasUpgrade("s", 22)) gain = gain.mul(upgradeEffect("s", 22))
	gain = gain.mul(tmp["s"].getEnergyEffect)

	if(hasMilestone("a", 0)) gain = gain.pow(1.15)
	if(hasUpgrade("c", 43)) gain = gain.pow(upgradeEffect("c", 43))
	if(hasUpgrade("inf", 12)) gain = gain.pow(upgradeEffect("inf", 12))
	if(player["au"].npProductDecrease) gain = gain.pow(0.85)

	if(inChallenge("inf", 11)) gain = gain.pow((new Decimal(9)).sub(challengeCompletions("inf", 11)).div(10).pow(0.75))
	return gain
}

// You can add non-layer related variables that should to into "player" and be saved here, along with default values
function addedPlayerData() { return {
}}

// Display extra things at the top of the page
var displayThings = [
]

// Determines when the game "ends"
function isEndgame() {
	return player.points.gte(new Decimal("e1750"))
}



// Less important things beyond this point!

// Style for the background, can be a function
var backgroundStyle = {

}

// You can change this if you have things that can be messed up by long tick lengths
function maxTickLength() {
	return(3600) // Default is 1 hour which is just arbitrarily large
}

// Use this if you need to undo inflation from an older version. If the version is older than the version that fixed the issue,
// you can cap their current resources with this.
function fixOldSave(oldVersion){
}