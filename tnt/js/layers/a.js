addLayer("a", {
    name: "Air", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "A", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    branches : ["c"],
    startData() { return {
        unlocked: false,
        points: new Decimal(0),
        spent : new Decimal(0),
        total : new Decimal(0),
        best  : new Decimal(0)
    }},
    color: "#dddddd",
    requires: function(){
        req = new Decimal("e41")
        req = req.mul(buyableEffect("a", 11))
        if(hasUpgrade("s", 24)) req = req.mul(upgradeEffect("s", 24))
        return req
    }, // Can be a function that takes requirement increases into account
    resource: "air points", // Name of prestige currency
    baseResource: "compressed null points", // Name of resource prestige is based on
    baseAmount() {return player["c"].points}, // Get the current amount of baseResource
    type: "static", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: function(){
        let exp = new Decimal(6)
        if(hasUpgrade("inf", 43)) exp = exp.sqrt().add(1)
        if(hasAchievement("ac", 42)) exp = exp.pow(0.75)
        if(hasUpgrade("s", 11)) exp = exp.pow(0.5)
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
        {key: "a", description: "A: Reset for air points", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
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
    buyables: {
        11: {
            title: "Cheaper", // Optional, displayed at the top in a larger font
            cost(x) { // cost for buying xth buyable, can be an object if there are multiple currencies
                let cost = x.exp().pow(0.2)
                return cost.floor()
            },
            effect(x) { // Effects of owning x of the items, x is a decimal
                let eff = new Decimal(0.92)
                return eff.pow(x);
            },
            display() { // Everything else displayed in the buyable button after the title
                let data = tmp[this.layer].buyables[this.id]
                return "Cost: " + format(data.cost) + " air points\n\
                Amount: " + player[this.layer].buyables[this.id] + " / 2000\n\
                Multiplies cost of upgrades in C and ap, fp, ep, wp cost by " + format(data.effect)
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
    		requirementDescription: "Have at least 1 ap",
    		effectDescription: "np gain is raised to 1.15th power.",
    		done() {return player[this.layer].points.gte(1)}
    	},
    	1: {
    		requirementDescription: "Have at least 2 ap",
    		effectDescription: "ap no more resets cp.",
    		done() {return player[this.layer].points.gte(2)}
    	},
    	2: {
    		requirementDescription: "Have at least 3 ap",
    		effectDescription: "best ap multiplits cp gain.",
    		done() {return player[this.layer].points.gte(3)}
    	},
    },
    doReset(resettingLayer) {
        if(layers[resettingLayer].row == "side" || layers[resettingLayer].row <= this.row) return
        let keep = []
        if((resettingLayer == "inf") && hasUpgrade(resettingLayer, 14) || (resettingLayer == "s") && hasUpgrade(resettingLayer, 13)) keep.push("milestones")
        layerDataReset(this.layer, keep)
    },
    automate() {
        if(hasUpgrade("inf", 21) && player["au"].autoRow2[0] && canReset(this.layer)) doReset(this.layer)
        if(hasUpgrade("inf", 31) && player["au"].autoRow2Upgrade[0]) {
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
        return !(hasUpgrade("inf", 21) && player["au"].autoRow2[0])
    }
})
