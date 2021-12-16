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
        egm: new Decimal(0),
        resetTime: 0,
        egcount: [
            new Decimal(0), new Decimal(0), new Decimal(0), new Decimal(0),
            new Decimal(0), new Decimal(0), new Decimal(0), new Decimal(0)
        ]
    }},
    color: "#cccd22",
    requires: function(){
        req = new Decimal("e500")
        if(player[this.layer].points.gt(100)) req = req.mul(player[this.layer].points.sub(99).div(20).add(1).exp())
        if(player[this.layer].points.gt(120)) req = req.pow(1.2)
        if(!hasUpgrade(this.layer, 34) && player[this.layer].points.gt(140)) req = req.mul(player[this.layer].points.sub(99).div(10).add(1).exp().exp())
        if(player[this.layer].points.gt(200)) req = req.mul(player[this.layer].points.sub(199).div(10).add(1).exp().exp())
        
        if(hasUpgrade(this.layer, 32)) req = req.pow(0.7)
        if(hasUpgrade(this.layer, 34)) req = req.pow(upgradeEffect(this.layer, 34))
        return req
    }, // Can be a function that takes requirement increases into account
    resource: "stars", // Name of prestige currency
    baseResource: "compressed null points", // Name of resource prestige is based on
    baseAmount() {return player["c"].points}, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: function(){
        let expo = new Decimal("0.05")
        if(hasUpgrade(this.layer, 32)) expo = expo.mul(10)
        return expo
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
        eff = eff.pow(buyableEffect(this.layer, 14)).pow(buyableEffect(this.layer, 21))
        if(hasUpgrade(this.layer, 31)) eff = eff.pow(upgradeEffect(this.layer, 31))
        if(hasUpgrade("p", 12)) eff = eff.pow(upgradeEffect("p", 12))
        return eff.add(1)
    },
    tabFormat: {
        "Upgrades": {
            content: [
                "main-display", 
                "prestige-button", 
                "blank",
                ["display-text", function(){
                    if(!hasUpgrade("s", 12)) return ""
                    return "You have " + format(player["s"].energy) + " energy, which multiply np gain by " + format(tmp["s"].getEnergyEffect) + ". (+" + format(tmp["s"].energyGenerationAmount) + "/s)"
                }],
                "blank",
                "upgrades",
            ],
        },
        "Boosters": {
            content: [
                ["display-text", function(){
                    if(!hasUpgrade("s", 12)) return ""
                    return "You have " + format(player["s"].energy) + " energy, which multiply np gain by " + format(tmp["s"].getEnergyEffect) + ". (+" + format(tmp["s"].energyGenerationAmount) + "/s)"
                }],
                ["display-text", function(){
                    if(!hasUpgrade("s", 12)) return ""
                    return "You have " + format(player[this.layer].egm) + " Energy Gain Multiplier(EGM). (+" + format(player[this.layer].egcount[0]) + "/s)"
                }],
                ["display-text", "Note that every generator bought (not generated) slightly increases generating speed."],
                "blank",
                "blank",
                "buyables",
            ],
        },
    },
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
                if(eff.gte(1e100)) eff = eff.sub(1e100).pow(0.1).add(1e100)
                if(eff.gte(1e110)) eff = eff.sub(1e110).pow(0.1).add(1e110)
                if(eff.gte(1e120)) eff = eff.sub(1e120).pow(0.1).add(1e120)
                if(eff.gte(1e130)) eff = new Decimal(1e130)
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
        31: {
            description: "np increases energy effect.",
            cost() {
                let cost = new Decimal(150)
                return cost
            },
            unlocked() {
                return hasUpgrade("s", 24)
            },
            effect() {
                let eff = player.points.add(1).ln().add(1).ln().add(1).pow(-1).exp().times(-1).add(7)
                return eff
            },
            effectDisplay() {
                return "^" + format(upgradeEffect(this.layer, this.id))
            }
        },
        32: {
            description: "Star cost grows slower (and also cheaper).",
            cost() {
                let cost = new Decimal(15)
                return cost
            },
            unlocked() {
                return hasUpgrade("s", 31)
            },
        },
        33: {
            description: "Get 50% of stars per second.",
            cost() {
                let cost = new Decimal(10)
                return cost
            },
            unlocked() {
                return hasUpgrade("s", 32)
            },
        },
        34: {
            description: "Energy reduces star price.",
            cost() {
                let cost = new Decimal(172.5)
                return cost
            },
            unlocked() {
                return hasUpgrade("s", 33)
            },
            effect() {
                let eff = player[this.layer].energy.add(1).ln().add(1).pow(-1).mul(0.9).add(0.1).pow(0.25)
                return eff
            },
            effectDisplay() {
                return "^" + format(upgradeEffect(this.layer, this.id))
            }
        },
    },
    buyables: {
        11: {
            title: "Stronger Energy", // Optional, displayed at the top in a larger font
            cost(x) { // cost for buying xth buyable, can be an object if there are multiple currencies
                let cost = (new Decimal(1.5)).add(x.mul(0.05)).pow(x).pow(0.35).mul(6000)
                if(x.gte(80)) cost = cost.pow(x.sub(69).div(10))
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
            style() {
                return {
                    "height": "140px",
                    "width": "140px"
                }
            }
        },
        12: {
            title: "Stronger^2 Energy", // Optional, displayed at the top in a larger font
            cost(x) { // cost for buying xth buyable, can be an object if there are multiple currencies
                let cost = (new Decimal(1.6)).add(x.mul(0.08)).pow(x).pow(0.4).mul(1e9)
                if(x.gte(30)) cost = cost.pow(x.sub(22).div(7))
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
            style() {
                return {
                    "height": "140px",
                    "width": "140px"
                }
            }
        },
        13: {
            title: "Stronger^3 Energy", // Optional, displayed at the top in a larger font
            cost(x) { // cost for buying xth buyable, can be an object if there are multiple currencies
                let cost = (new Decimal(2)).add(x.mul(0.11)).pow(x).pow(0.45).mul(1e18)
                if(x.gte(10)) cost = cost.pow(x.sub(8).div(2))
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
            style() {
                return {
                    "height": "140px",
                    "width": "140px"
                }
            },
            buyMax() {
                while(player[this.layer].buyables[this.id].canAfford) {
                    cost = tmp[this.layer].buyables[this.id].cost
                    player[this.layer].energy = player[this.layer].energy.sub(cost) 
                    player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(1)
                }
            }
        },
        14: {
            title: "Stronger^^2 Energy", // Optional, displayed at the top in a larger font
            cost(x) { // cost for buying xth buyable, can be an object if there are multiple currencies
                let cost = (new Decimal(2)).add(x.mul(0.7)).pow(x).pow(0.45).mul(8e29)
                if(x.gte(10)) cost = cost.pow(x.sub(8).div(2))
                return cost
            },
            effect(x) { // Effects of owning x of the items, x is a decimal
                let eff = x.mul(0.1).pow(0.5).add(1)
                return eff;
            },
            display() { // Everything else displayed in the buyable button after the title
                let data = tmp[this.layer].buyables[this.id]
                return "Cost: " + format(data.cost) + " energy\n\
                Energy power becomes ^" + format(data.effect) + "\n\
                Next: ^" + format(this.effect(player[this.layer].buyables[this.id].add(1)))
            },
            unlocked() { return player[this.layer].buyables[44].gte(2) }, 
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
            style() {
                return {
                    "height": "140px",
                    "width": "140px"
                }
            },
            buyMax() {
                while(player[this.layer].buyables[this.id].canAfford) {
                    cost = tmp[this.layer].buyables[this.id].cost
                    player[this.layer].energy = player[this.layer].energy.sub(cost) 
                    player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(1)
                }
            }
        },
        41: {
            title: "1st Energy Generator", // Optional, displayed at the top in a larger font
            cost(x) { // cost for buying xth buyable, can be an object if there are multiple currencies
                let cost = (new Decimal(10)).add(x).pow(x).pow(0.35).mul(1e9)
                return cost.floor()
            },
            effect(x) { // Effects of owning x of the items, x is a decimal
                let eff = x.add(1)
                return eff;
            },
            display() { // Everything else displayed in the buyable button after the title
                let data = tmp[this.layer].buyables[this.id]
                return "Cost: " + format(data.cost) + " energy\n\
                Generates EGM."
            },
            unlocked() { return hasAchievement("ac", 51) }, 
            canAfford() {
                return player[this.layer].energy.gte(tmp[this.layer].buyables[this.id].cost)
            },
            buy() { 
                cost = tmp[this.layer].buyables[this.id].cost
                player[this.layer].energy = player[this.layer].energy.sub(cost) 
                player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(1)
                player[this.layer].egcount[0] = player[this.layer].egcount[0].add(1)
                //player[this.layer].spentOnBuyables = player[this.layer].spentOnBuyables.add(cost) // This is a built-in system that you can use for respeccing but it only works with a single Decimal value
            },
            purchaseLimit: new Decimal(1e308),
            style() {
                return {
                    "height": "140px",
                    "width": "140px"
                }
            }
        },
        42: {
            title: "2nd Energy Generator", // Optional, displayed at the top in a larger font
            cost(x) { // cost for buying xth buyable, can be an object if there are multiple currencies
                let cost = (new Decimal(100)).add(x).pow(x).pow(0.41).mul(3.2e15)
                return cost
            },
            effect(x) { // Effects of owning x of the items, x is a decimal
                let eff = x.add(1).pow(2)
                return eff;
            },
            display() { // Everything else displayed in the buyable button after the title
                let data = tmp[this.layer].buyables[this.id]
                return "Cost: " + format(data.cost) + " energy\n\
                Generates 1st EG."
            },
            unlocked() { return hasAchievement("ac", 51) }, 
            canAfford() {
                return player[this.layer].energy.gte(tmp[this.layer].buyables[this.id].cost)
            },
            buy() { 
                cost = tmp[this.layer].buyables[this.id].cost
                player[this.layer].energy = player[this.layer].energy.sub(cost) 
                player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(1)
                player[this.layer].egcount[1] = player[this.layer].egcount[1].add(1)
                //player[this.layer].spentOnBuyables = player[this.layer].spentOnBuyables.add(cost) // This is a built-in system that you can use for respeccing but it only works with a single Decimal value
            },
            purchaseLimit: new Decimal(1e308),
            style() {
                return {
                    "height": "140px",
                    "width": "140px"
                }
            }
        },
        43: {
            title: "3rd Energy Generator", // Optional, displayed at the top in a larger font
            cost(x) { // cost for buying xth buyable, can be an object if there are multiple currencies
                let cost = (new Decimal(1000)).add(x).pow(x).pow(0.47).mul(5e18)
                return cost
            },
            effect(x) { // Effects of owning x of the items, x is a decimal
                let eff = x.add(1).pow(3)
                return eff;
            },
            display() { // Everything else displayed in the buyable button after the title
                let data = tmp[this.layer].buyables[this.id]
                return "Cost: " + format(data.cost) + " energy\n\
                Generates 2nd EG."
            },
            unlocked() { return hasAchievement("ac", 51) }, 
            canAfford() {
                return player[this.layer].energy.gte(tmp[this.layer].buyables[this.id].cost)
            },
            buy() { 
                cost = tmp[this.layer].buyables[this.id].cost
                player[this.layer].energy = player[this.layer].energy.sub(cost) 
                player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(1)
                player[this.layer].egcount[2] = player[this.layer].egcount[2].add(1)
                //player[this.layer].spentOnBuyables = player[this.layer].spentOnBuyables.add(cost) // This is a built-in system that you can use for respeccing but it only works with a single Decimal value
            },
            purchaseLimit: new Decimal(1e308),
            style() {
                return {
                    "height": "140px",
                    "width": "140px"
                }
            }
        },
        44: {
            title: "4st Energy Generator", // Optional, displayed at the top in a larger font
            cost(x) { // cost for buying xth buyable, can be an object if there are multiple currencies
                let cost = (new Decimal(6900)).add(x.mul(1.8)).pow(x).pow(0.59).mul(2e26)
                return cost
            },
            effect(x) { // Effects of owning x of the items, x is a decimal
                let eff = x.add(1).pow(3)
                return eff;
            },
            display() { // Everything else displayed in the buyable button after the title
                let data = tmp[this.layer].buyables[this.id]
                return "Cost: " + format(data.cost) + " energy\n\
                Generates 3rd RG."
            },
            unlocked() { return hasAchievement("ac", 51) }, 
            canAfford() {
                return player[this.layer].energy.gte(tmp[this.layer].buyables[this.id].cost)
            },
            buy() { 
                cost = tmp[this.layer].buyables[this.id].cost
                player[this.layer].energy = player[this.layer].energy.sub(cost) 
                player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(1)
                player[this.layer].egcount[3] = player[this.layer].egcount[0].add(3)
                //player[this.layer].spentOnBuyables = player[this.layer].spentOnBuyables.add(cost) // This is a built-in system that you can use for respeccing but it only works with a single Decimal value
            },
            purchaseLimit: new Decimal(1e308),
            style() {
                return {
                    "height": "140px",
                    "width": "140px"
                }
            },
            buyMax() {
                while(player[this.layer].buyables[this.id].canAfford) {
                    cost = tmp[this.layer].buyables[this.id].cost
                    player[this.layer].energy = player[this.layer].energy.sub(cost) 
                    player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(1)
                    player[this.layer].egcount[3] = player[this.layer].egcount[0].add(3)
                }
            }
        },
        21: {
            title: "Stronger^^1.5 Energy", // Optional, displayed at the top in a larger font
            cost(x) { // cost for buying xth buyable, can be an object if there are multiple currencies
                let cost = (new Decimal(2)).add(x.mul(1.5)).pow(x).pow(0.49).mul(1e58)
                if(x.gte(10)) cost = cost.pow(x.sub(8).div(2))
                return cost
            },
            effect(x) { // Effects of owning x of the items, x is a decimal
                let eff = x.mul(0.3).pow(0.25).div(7).add(1)
                return eff;
            },
            display() { // Everything else displayed in the buyable button after the title
                let data = tmp[this.layer].buyables[this.id]
                return "Cost: " + format(data.cost) + " energy\n\
                Energy power becomes ^" + format(data.effect) + "\n\
                Next: ^" + format(this.effect(player[this.layer].buyables[this.id].add(1)))
            },
            unlocked() { return hasUpgrade("p", 14) }, 
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
            style() {
                return {
                    "height": "140px",
                    "width": "140px"
                }
            },
            buyMax() {
                while(player[this.layer].buyables[this.id].canAfford) {
                    cost = tmp[this.layer].buyables[this.id].cost
                    player[this.layer].energy = player[this.layer].energy.sub(cost) 
                    player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(1)
                }
            }
        },
        22: {
            title: "Faster Energy", // Optional, displayed at the top in a larger font
            cost(x) { // cost for buying xth buyable, can be an object if there are multiple currencies
                let cost = (new Decimal(2.5)).add(x.mul(3)).pow(x.mul(2)).pow(0.72).mul(1e58)
                if(x.gte(10)) cost = cost.pow(x.sub(8).div(2))
                return cost
            },
            effect(x) { // Effects of owning x of the items, x is a decimal
                let eff = (new Decimal(1e3)).pow(x.pow(1.5))
                return eff;
            },
            display() { // Everything else displayed in the buyable button after the title
                let data = tmp[this.layer].buyables[this.id]
                return "Cost: " + format(data.cost) + " energy\n\
                Energy generation becomes x" + format(data.effect) + "\n\
                Next: x" + format(this.effect(player[this.layer].buyables[this.id].add(1)))
            },
            unlocked() { return hasUpgrade("p", 14) }, 
            canAfford() {
                return player[this.layer].energy.gte(tmp[this.layer].buyables[this.id].cost)
            },
            buy() { 
                cost = tmp[this.layer].buyables[this.id].cost
                player[this.layer].energy = player[this.layer].energy.sub(cost) 
                player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(1)
                //player[this.layer].spentOnBuyables = player[this.layer].spentOnBuyables.add(cost) // This is a built-in system that you can use for respeccing but it only works with a single Decimal value
            },
            purchaseLimit: new Decimal(100),
            style() {
                return {
                    "height": "140px",
                    "width": "140px"
                }
            },
            buyMax() {
                while(player[this.layer].buyables[this.id].canAfford) {
                    cost = tmp[this.layer].buyables[this.id].cost
                    player[this.layer].energy = player[this.layer].energy.sub(cost) 
                    player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(1)
                }
            }
        },
    },
    energyGenerationAmount() {
        if(!hasUpgrade("s", 12)) return new Decimal(0)
        let amt = player[this.layer].points.exp().pow(0.5)
        if(hasUpgrade("s", 21)) amt = amt.mul(upgradeEffect("s", 21))
        if(hasUpgrade("s", 23)) amt = amt.mul(upgradeEffect("s", 23))
        if(player[this.layer].points.lt(1)) amt = new Decimal(0)
        amt = amt.mul(player[this.layer].egm.add(1))
        if(player[this.layer].buyables[41].gte(25)) amt = amt.pow(1.1)

        if(hasAchievement("ac", 51)) amt = amt.mul(buyableEffect(this.layer, 11).mul(buyableEffect(this.layer, 12)).mul(buyableEffect(this.layer, 13)).pow(0.5))
        
        if(hasUpgrade("p", 11)) amt = amt.pow(1.1)

        amt = amt.mul(buyableEffect("s", 22))
        
        if(amt.gte(1e18)) amt = amt.sub(1e18).pow(0.89).add(1e18)
        if(amt.gte(1e24)) amt = amt.sub(1e24).pow(0.87).add(1e24)
        if(amt.gte(1e28)) amt = amt.sub(1e28).pow(0.80).add(1e28)
        if(amt.gte(1e32)) amt = amt.sub(1e32).pow(0.80).add(1e32)
        if(amt.gte(1e37)) amt = amt.sub(1e37).pow(0.90).add(1e37)
        if(amt.gte(1e42)) amt = amt.sub(1e42).pow(0.86).add(1e42)
        if(amt.gte(1e47)) amt = amt.sub(1e47).pow(0.80).add(1e47)
        if(amt.gte(1e57)) amt = amt.sub(1e57).pow(0.90).add(1e57)

        return amt
    },
    update(diff) {
        player[this.layer].energy = player[this.layer].energy.add(tmp[this.layer].energyGenerationAmount.mul(diff))
        player[this.layer].egm = player[this.layer].egm.add(player[this.layer].egcount[0].mul(diff).mul((new Decimal(1.02)).pow(player[this.layer].buyables["41"])))
        for(var i = 0; i < 3; i += 1) {
            player[this.layer].egcount[i] = player[this.layer].egcount[i + 1].mul(1.0 - (i + 1) / 8).mul(diff).mul((new Decimal(1.02)).pow(player[this.layer].buyables["4" + (i + 2)])).add(player[this.layer].egcount[i])
        }
    },
    challenges: {
        
    },
    passiveGeneration() {
        gen = new Decimal(0)
        if(hasUpgrade(this.layer, 33)) gen = gen.add(0.5)
        return gen
    }
})
