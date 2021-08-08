let modInfo = {
	name: "The Null Tree",
	id: "null_tree",
	author: "vgakbzc",
	pointsName: "null points",
	modFiles: ["layers/c.js", "layers/a.js", "layers/f.js", "layers/e.js", "layers/w.js", "layers/ac.js", "layers/id.js", "tree.js"],

	discordName: "",
	discordLink: "",
	initialStartPoints: new Decimal (0), // Used for hard resets and new players
	//offlineLimit() {
	//	return buyableEffect("id", 11)
	//},  // In hours
	offlineLimit: 24
}

// Set your version in num and name
let VERSION = {
	num: "0.0.2",
	name: "Inertia Update",
}

let changelog = `<h1>Changelog:</h1><br>
	<h3>v0.0.1</h3><br>
		- Added node Id, Ac, A, F, W, E and C.<br>
		- Added some upgrades for nodes mentioned above.<br>
	<h3>v0.0.2</h3><br>
		- Changed currency of node Id into Inertia.<br>
		- Added 3 upgrades for node Id.<br>`

let winText = `Congratulations! You have reached the end and beaten this game, but for now...`

// If you add new functions anywhere inside of a layer, and those functions have an effect when called, add them here.
// (The ones here are examples, all official functions are already taken care of)
var doNotCallTheseFunctionsEveryTick = ["blowUpEverything"]

function getStartPoints(){
    return new Decimal(modInfo.initialStartPoints)
}

// Determines if it should show points/sec
function canGenPoints(){
	return true
}

// Calculate points/sec!
function getPointGen() {
	if(!canGenPoints())
		return new Decimal(0)

	let gain = new Decimal(0)
	if(hasUpgrade('c', 11)) gain = gain.add(1);
	if(hasUpgrade('c', 12)) gain = gain.times(upgradeEffect("c", 12));
	if(hasUpgrade('c', 13)) gain = gain.times(upgradeEffect("c", 13));
	if(hasUpgrade('c', 33)) gain = gain.times(new Decimal("e5"));
	return gain.mul(player["ac"].points.mul(0.01).sub(1).mul(buyableEffect("w", 11)).add(1))
}

// You can add non-layer related variables that should to into "player" and be saved here, along with default values
function addedPlayerData() { return {
}}

// Display extra things at the top of the page
var displayThings = [
]

// Determines when the game "ends"
function isEndgame() {
	return player.points.gte(new Decimal("e280000000"))
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