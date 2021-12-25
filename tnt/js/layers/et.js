addLayer("et", {
    name: "Eternity", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "Et", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 3, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    branches : ["inf", "s", "p"],
    startData() { return {
        unlocked: false,
        points: new Decimal(0),
        best: new Decimal(0),
        shown: false
    }},
    color: "#ff22ff",
    requires: function(){
        req = new Decimal("e512")
        return req
    }, // Can be a function that takes requirement increases into account
    resource: "eternity points", // Name of prestige currency
    baseResource: "infinity points", // Name of resource prestige is based on
    baseAmount() {return player["inf"].points}, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: function(){
        return new Decimal("0.00333333333")
    }, // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(0.01)
    },
    softcap() {
        return new Decimal(1)
    },
    softcapPower() {
        return new Decimal(0.01)
    },
    row: 3, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
        {key: "t", description: "T: Reset for eternity points.", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    layerShown(){
        if(player["inf"].points.gte(new Decimal("e400"))) player[this.layer].shown = true
        return player[this.layer].shown
    },
    upgrades: {
        
    },
})
