addLayer("p", {
    name: "Planet", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "P", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 4, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    branches : ["e", "w"],
    startData() { return {
        unlocked: false,
        points: new Decimal(0),
        best: new Decimal(0),
        shown: false
    }},
    color: "#11ffcc",
    requires: function(){
        req = new Decimal("e1725")
        return req
    }, // Can be a function that takes requirement increases into account
    resource: "planets", // Name of prestige currency
    baseResource: "compressed null points", // Name of resource prestige is based on
    baseAmount() {return player["c"].points}, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: function(){
        return new Decimal("0.333333333")
    }, // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(0.1)
    },
    softcap() {
        return new Decimal(1e5)
    },
    softcapPower() {
        return new Decimal(0.1)
    },
    row: 2, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
        {key: "p", description: "P: Reset for stars", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    layerShown(){
        if(hasUpgrade("inf", 44)) player[this.layer].shown = true
        return player[this.layer].shown
    },
    upgrades: {
        11:{
            description: "Energy generation becomes ^1.1.",
            cost() {
                let cost = (new Decimal(1))
                return cost
            },
        },
        12:{
            description: "Planets increases energy power.",
            cost() {
                let cost = (new Decimal(1e5))
                return cost
            },
            effect() {
                let eff = player["p"].points.add(1).ln().add(1).pow(-0.05).mul(-1).add(2).pow(2.3).mul(2)
                return eff
            },
            effectDisplay() {
                return "^" + format(upgradeEffect("p", 12))
            }
        },
        13:{
            description: "Planets increases ip gain.",
            cost() {
                let cost = (new Decimal(1e12))
                return cost
            },
            effect() {
                let eff = player["p"].points.add(1).ln().add(1).pow(-0.05).mul(-1).add(2).pow(1.9).mul(1.7)
                return eff
            },
            effectDisplay() {
                return "^" + format(upgradeEffect("p", 13))
            }
        },
        14: {
            description: "Get 1% planets every second.",
            cost() {
                let cost = (new Decimal(5e12))
                return cost
            },
        }
    },
    passiveGeneration() {
        let gen = new Decimal(0)
        if(hasUpgrade("p", 14)) gen = gen.add(0.01)
        return gen
    }
})
