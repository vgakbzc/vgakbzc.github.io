addLayer("s", {
    name: "Star", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "S", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 1, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    branches : ["f", "a"],
    startData() { return {
        unlocked: false,
        points: new Decimal(0),
        best: new Decimal(0),
        shown: false,
        energy: new Decimal(0),
        resetTime: 0,
    }},
    color: "#cccd22",
    requires: function(){
        req = new Decimal("e500")
        return req
    }, // Can be a function that takes requirement increases into account
    resource: "stars", // Name of prestige currency
    baseResource: "compressed null points", // Name of resource prestige is based on
    baseAmount() {return player["c"].points}, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: function(){
        return new Decimal("0.05")
    }, // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
    row: 2, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
        {key: "s", description: "S: Reset for stars", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    layerShown(){
        if(hasUpgrade("inf", 44)) player[this.layer].shown = true
        return player[this.layer].shown
    },
    softcap() {
        return new Decimal(1)
    },
    softcapPower() {
        return new Decimal(0.001)
    },
    getEnergyEffect() {
        let eff = upgradeEffect("s", 12)
        eff = eff.mul(buyableEffect(this.layer, 11)).mul(buyableEffect(this.layer, 12)).mul(buyableEffect(this.layer, 13))
        return eff.add(1)
    },
    midsection: [
        ["display-text", function(){
            if(!hasUpgrade("s", 12)) return ""
            return "You have " + format(player["s"].energy) + " energy, which multiply np gain by " + format(tmp["s"].getEnergyEffect) + ". (+" + format(tmp["s"].energyGenerationAmount) + "/s)"
        }],
    ],
    upgrades: {
        11: {
            description: "Prices of ap and fp grows slower.",
            cost() {
                let cost = new Decimal(1)
                return cost
            }
        },
        12: {
            description: "Stars generates energy which mutiplies np gain.",
            cost() {
                let cost = new Decimal(5)
                return cost
            },
            effect() {
                let eff = player[this.layer].energy
                if(eff.gte("e1000")) eff = eff.sub("e1000").pow(0.33333).add("e1000")
                return eff
            },
            effectDisplay() {
                return "x" + format(upgradeEffect(this.layer, this.id))
            },
            unlocked() {
                return hasUpgrade("s", 11)
            }
        },
        13: {
            description: "Keeps milestones in A and F on reset.",
            cost() {
                let cost = new Decimal(5)
                return cost
            },
            unlocked() {
                return hasUpgrade("s", 12)
            }
        },
        14: {
            description: "Get 1e-32% of cp per second even if there's no milestone 1 in E.",
            cost() {
                let cost = new Decimal(3)
                return cost
            },
            unlocked() {
                return hasUpgrade("s", 13)
            }
        },
        21: {
            description: "np increases energy generation.",
            cost() {
                let cost = new Decimal(10)
                return cost
            },
            unlocked() {
                return hasUpgrade("s", 14)
            },
            effect() {
                let eff = player.points.add(1).ln().add(1)
                return eff
            },
            effectDisplay() {
                return "x" + format(upgradeEffect(this.layer, this.id))
            }
        },
        22: {
            description: "Give np gain a multiplier increases by time.",
            cost() {
                let cost = new Decimal(5e5)
                return cost
            },
            currencyDisplayName() {
                return "Energy"
            },
            unlocked() {
                return hasUpgrade("s", 21)
            },
            currencyLocation() {
                return player[this.layer]
            },
            currencyInternalName() {
                return "energy"
            },
            effect() {
                let eff = (new Decimal(player[this.layer].resetTime)).exp().pow(1.5)
                if(eff.gte(1e63)) eff = eff.sub(1e63).pow(0.45).add(1e63)
                return eff
            },
            effectDisplay() {
                return "x" + format(upgradeEffect(this.layer, this.id))
            }
        },
        23: {
            description: "Energy increases energy gain.",
            cost() {
                let cost = new Decimal(1.5e6)
                return cost
            },
            currencyDisplayName() {
                return "Energy"
            },
            unlocked() {
                return hasUpgrade("s", 22)
            },
            currencyLocation() {
                return player[this.layer]
            },
            currencyInternalName() {
                return "energy"
            },
            effect() {
                let eff = player[this.layer].energy.add(1).ln().add(1)
                return eff
            },
            effectDisplay() {
                return "x" + format(upgradeEffect(this.layer, this.id))
            }
        },
        24: {
            description: "Energy decreases fp/ap cost.",
            cost() {
                let cost = new Decimal(1e9)
                return cost
            },
            currencyDisplayName() {
                return "Energy"
            },
            unlocked() {
                return hasUpgrade("s", 23)
            },
            currencyLocation() {
                return player[this.layer]
            },
            currencyInternalName() {
                return "energy"
            },
            effect() {
                let eff = player[this.layer].energy.add(1).ln().add(1).pow(-7)
                return eff
            },
            effectDisplay() {
                return "/" + format(upgradeEffect(this.layer, this.id).pow(-1))
            }
        },
    },
    buyables: {
        11: {
            title: "Stronger Energy", // Optional, displayed at the top in a larger font
            cost(x) { // cost for buying xth buyable, can be an object if there are multiple currencies
                let cost = (new Decimal(1.5)).add(x.mul(0.05)).pow(x).pow(0.35).mul(6000)
                return cost.floor()
            },
            effect(x) { // Effects of owning x of the items, x is a decimal
                let eff = x.add(1)
                return eff;
            },
            display() { // Everything else displayed in the buyable button after the title
                let data = tmp[this.layer].buyables[this.id]
                return "Cost: " + format(data.cost) + " energy\n\
                Multiplies energy effect by " + format(data.effect) + "\n\
                Next: x" + format(this.effect(player[this.layer].buyables[this.id].add(1)))
            },
            unlocked() { return hasUpgrade(this.layer, 14) }, 
            canAfford() {
                return player[this.layer].energy.gte(tmp[this.layer].buyables[this.id].cost)
            },
            buy() { 
                cost = tmp[this.layer].buyables[this.id].cost
                player[this.layer].energy = player[this.layer].energy.sub(cost) 
                player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(1)
                //player[this.layer].spentOnBuyables = player[this.layer].spentOnBuyables.add(cost) // This is a built-in system that you can use for respeccing but it only works with a single Decimal value
            },
            purchaseLimit: new Decimal(1e308),
        },
        12: {
            title: "Stronger^2 Energy", // Optional, displayed at the top in a larger font
            cost(x) { // cost for buying xth buyable, can be an object if there are multiple currencies
                let cost = (new Decimal(1.6)).add(x.mul(0.08)).pow(x).pow(0.4).mul(1e9)
                return cost
            },
            effect(x) { // Effects of owning x of the items, x is a decimal
                let eff = x.add(1).pow(2)
                return eff;
            },
            display() { // Everything else displayed in the buyable button after the title
                let data = tmp[this.layer].buyables[this.id]
                return "Cost: " + format(data.cost) + " energy\n\
                Multiplies energy effect by " + format(data.effect) + "\n\
                Next: x" + format(this.effect(player[this.layer].buyables[this.id].add(1)))
            },
            unlocked() { return hasUpgrade(this.layer, 24) }, 
            canAfford() {
                return player[this.layer].energy.gte(tmp[this.layer].buyables[this.id].cost)
            },
            buy() { 
                cost = tmp[this.layer].buyables[this.id].cost
                player[this.layer].energy = player[this.layer].energy.sub(cost) 
                player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(1)
                //player[this.layer].spentOnBuyables = player[this.layer].spentOnBuyables.add(cost) // This is a built-in system that you can use for respeccing but it only works with a single Decimal value
            },
            purchaseLimit: new Decimal(1e308),
        },
        13: {
            title: "Stronger^3 Energy", // Optional, displayed at the top in a larger font
            cost(x) { // cost for buying xth buyable, can be an object if there are multiple currencies
                let cost = (new Decimal(1.8)).add(x.mul(0.11)).pow(x).pow(0.45).mul(1e18)
                return cost
            },
            effect(x) { // Effects of owning x of the items, x is a decimal
                let eff = x.add(1).pow(3)
                return eff;
            },
            display() { // Everything else displayed in the buyable button after the title
                let data = tmp[this.layer].buyables[this.id]
                return "Cost: " + format(data.cost) + " energy\n\
                Multiplies energy effect by " + format(data.effect) + "\n\
                Next: x" + format(this.effect(player[this.layer].buyables[this.id].add(1)))
            },
            unlocked() { return hasUpgrade(this.layer, 24) }, 
            canAfford() {
                return player[this.layer].energy.gte(tmp[this.layer].buyables[this.id].cost)
            },
            buy() { 
                cost = tmp[this.layer].buyables[this.id].cost
                player[this.layer].energy = player[this.layer].energy.sub(cost) 
                player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(1)
                //player[this.layer].spentOnBuyables = player[this.layer].spentOnBuyables.add(cost) // This is a built-in system that you can use for respeccing but it only works with a single Decimal value
            },
            purchaseLimit: new Decimal(1e308),
        },
    },
    energyGenerationAmount() {
        let amt = player[this.layer].points.exp().pow(0.5)
        if(hasUpgrade("s", 21)) amt = amt.mul(upgradeEffect("s", 21))
        if(hasUpgrade("s", 23)) amt = amt.mul(upgradeEffect("s", 23))
        if(player[this.layer].points.lt(1)) amt = new Decimal(0)

        if(hasAchievement("ac", 51)) amt = amt.mul(buyableEffect(this.layer, 11).mul(buyableEffect(this.layer, 12)).mul(buyableEffect(this.layer, 13)).pow(0.5))
        return amt
    },
    update(diff) {
        player[this.layer].energy = player[this.layer].energy.add(tmp[this.layer].energyGenerationAmount.mul(diff))
    },
    challenges: {
        
    }
})
