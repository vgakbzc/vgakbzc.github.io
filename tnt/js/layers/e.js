addLayer("e", {
    name: "Earth", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "E", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 2, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    branches : ["c"],
    startData() { return {
        unlocked: false,
        points: new Decimal(0),
        spent : new Decimal(0),
        total : new Decimal(0),
        best  : new Decimal(0)
    }},
    color: "#ae8b51",
    requires: function(){
        req = new Decimal("e41")
        req = req.mul(buyableEffect("a", 11))
        return req
    }, // Can be a function that takes requirement increases into account
    resource: "earth points", // Name of prestige currency
    baseResource: "compressed null points", // Name of resource prestige is based on
    baseAmount() {return player["c"].points}, // Get the current amount of baseResource
    type: "static", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: function(){
        let exp = new Decimal(6)
        if(hasUpgrade("inf", 43)) exp = exp.sqrt().add(1)
        if(hasAchievement("ac", 42)) exp = exp.pow(0.75)
        return exp
    }, // Prestige currency exponent
    base: new Decimal(2.5),
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
    row: 1, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
        {key: "e", description: "E: Reset for earth points", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    layerShown(){
        for(var i in player[this.layer].branches) {
            if(player[player[this.layer].branches[i]].unlocked == false) {
                return false
            }
        }
        return true
    },
    canBuyMax() {
        return hasUpgrade("inf", 13)
    },
    doReset(resettingLayer) {
        if(layers[resettingLayer].row == "side" || layers[resettingLayer].row <= this.row) return
        let keep = []
        if((resettingLayer == "inf") && hasUpgrade(resettingLayer, 14)) keep.push("milestones")
        layerDataReset(this.layer, keep)
    },
    buyables: {
        11: {
            title: "Slower cp cost growth", // Optional, displayed at the top in a larger font
            cost(x) { // cost for buying xth buyable, can be an object if there are multiple currencies
                let cost = x.exp().pow(0.2)
                return cost.floor()
            },
            effect(x) { // Effects of owning x of the items, x is a decimal
                let eff = x.pow(0.75).dividedBy((new Decimal(1900)).pow(0.75))
                return eff
            },
            display() { // Everything else displayed in the buyable button after the title
                let data = tmp[this.layer].buyables[this.id]
                return "Cost: " + format(data.cost) + " earth points\n\
                Amount: " + player[this.layer].buyables[this.id] + " / 2000\n\
                cp cost exponent decreased by " + format(data.effect)
            },
            unlocked() { return true }, 
            canAfford() {
                return player[this.layer].points.gte(tmp[this.layer].buyables[this.id].cost)
            },
            buy() { 
                cost = tmp[this.layer].buyables[this.id].cost
                player[this.layer].points = player[this.layer].points.sub(cost) 
                player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(1)
                player[this.layer].spentOnBuyables = player[this.layer].spentOnBuyables.add(cost) // This is a built-in system that you can use for respeccing but it only works with a single Decimal value
            },
            purchaseLimit: new Decimal(2000),
        },
    },
    milestones: {
        0: {
            requirementDescription: "Have at least 1 ep",
            effectDescription: "You get 2% of cp every second.",
            done() {return player[this.layer].points.gte(1)}
        },
        1: {
            requirementDescription: "Have at least 2 ep",
            effectDescription: "ep no more resets cp.",
            done() {return player[this.layer].points.gte(2)}
        },
        2: {
            requirementDescription: "Have at least 3 ep",
            effectDescription: "best ep multiplits cp gain.",
            done() {return player[this.layer].points.gte(3)}
        },
    },
    automate() {
        if(hasUpgrade("inf", 23) && player["au"].autoRow2[2] && canReset(this.layer)) doReset(this.layer)
        if(hasUpgrade("inf", 33) && player["au"].autoRow2Upgrade[2]) {
            for(i in player[this.layer].buyables) {
                if(!player[this.layer].points.gte(tmp[this.layer].buyables[i].cost)) continue
                cost = tmp[this.layer].buyables[i].cost
                player[this.layer].points = player[this.layer].points.sub(cost) 
                player[this.layer].buyables[i] = player[this.layer].buyables[i].add(1)
                player[this.layer].spentOnBuyables = player[this.layer].spentOnBuyables.add(cost)
            }
        }
    },
    milestonePopups() {
        return !(hasUpgrade("inf", 23) && player["au"].autoRow2[2])
    }
})
