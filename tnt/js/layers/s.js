/*addLayer("s", {
    name: "Star", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "S", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 2, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    branches : ["f", "a"],
    startData() { return {
        unlocked: false,
        points: new Decimal(0),
        best: new Decimal(0),
    }},
    color: "#cccd22",
    requires: function(){
        req = new Decimal("1e100000000")
        return req
    }, // Can be a function that takes requirement increases into account
    resource: "stars", // Name of prestige currency
    baseResource: "compressed null points", // Name of resource prestige is based on
    baseAmount() {return player["c"].points}, // Get the current amount of baseResource
    type: "static", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: function(){
        return 1.5
    }, // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
    row: 2, // Row the layer is in on the tree (0 is the first row)
    base: 100,
    hotkeys: [
        {key: "s", description: "S: Reset for stars", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    layerShown(){
        //return player["f"].unlocked && player["a"].unlocked
        return false
    },
    upgrades: {
        11: {
            description: "Multiplies fwea gain based on best stars.",
            cost: new Decimal(2),
            effect() {
                return (new Decimal("1.5")).pow(player[this.layer].best)
            },
            effectDisplay() {
                return "Multiplies points gain on row 2 by " + format(upgradeEffect(this.layer, this.id))
            },
        },
    },
})
*/