var EtUpgPage = 1
let EtMaxUpgPage = 3

addLayer("et", {
    name: "Eternity", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "Et", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 3, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    branches : ["s","inf","p"],
    startData() { return {
        unlocked: false,
        points: new Decimal(0),
        best: new Decimal(0),
        shown: false,
        rp: new Decimal(0),
        progress:{
        	"np": new Decimal(0),
        	"cp": new Decimal(0),
        	"pl": new Decimal(0),
        	"eg": new Decimal(0),
            "rp": new Decimal(0)
        },
        level:{
        	"np": new Decimal(0),
        	"cp": new Decimal(0),
        	"pl": new Decimal(0),
        	"eg": new Decimal(0)
        },
        stats:{
        	"np": false,
        	"cp": false,
        	"pl": false,
        	"eg": false,
            "rp": false
        },
    }},
    color: "#ff22ff",
    requires: function(){
        req = new Decimal("e742")
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
    getPow() {
    	if(player[this.layer].best.lte(1)) {
    		return new Decimal(0)
    	}
    	let powr = (player[this.layer].best)
        if(hasUpgrade(this.layer, "43")) powr = powr.add(player[this.layer].rp.pow(0.5))
        powr = powr.ln().mul(1.4426950408889634)
    	powr = powr.mul(player[this.layer].best.ln().mul(1.4427).pow(3))

        if(hasUpgrade(this.layer, "13")) powr = powr.mul(2)

        if(hasUpgrade(this.layer, "52")) powr = powr.mul(upgradeEffect(this.layer, "52"))
        if(hasUpgrade(this.layer, "63")) powr = powr.mul(upgradeEffect(this.layer, "63"))
        if(hasUpgrade(this.layer, "82")) powr = powr.mul(upgradeEffect(this.layer, "82"))

        if(hasUpgrade(this.layer, "54")) powr = powr.pow(1.05)

        powr = expSoftCap(powr, new Decimal("e10"), 2)
        return powr
    },
    boosterMulti() {
        let mult = new Decimal(1)
        return mult
    },
    boosterExponent() {
        let exp = new Decimal(0)
        if(hasUpgrade(this.layer,"11")) exp = exp.add(1)
        if(hasUpgrade(this.layer,"12")) exp = exp.add(0.5)
        if(hasUpgrade(this.layer,"53")) exp = exp.add(1.5)
        if(hasUpgrade(this.layer,"71")) exp = exp.add(2)
        if(hasUpgrade(this.layer,"72")) exp = exp.add(2)
        if(hasAchievement("ac",64)) exp = exp.add(1)
        if(hasAchievement("ac",72)) exp = exp.add(0.42)
        if(hasUpgrade(this.layer,"22")) exp = exp.add(upgradeEffect(this.layer, 22))
        if(hasUpgrade(this.layer,"23")) exp = exp.add(upgradeEffect(this.layer, 23))
        if(hasUpgrade(this.layer,"74")) exp = exp.add(upgradeEffect(this.layer, 74))
        if(hasUpgrade(this.layer,"83")) exp = exp.add(upgradeEffect(this.layer, 83))

        if(hasUpgrade(this.layer,"73")) exp = exp.mul(1.5)
        if(hasUpgrade(this.layer,"81")) exp = exp.mul(1.5)
        if(hasUpgrade(this.layer,"84")) exp = exp.mul(1.5)
        if(hasUpgrade(this.layer,"94")) exp = exp.mul(8.88)

        return exp
    },
    getEffect() {
    	let eff={"np":new Decimal(0),}
    	for(i in player[this.layer].level){
    		eff[i]=(new Decimal(1)).add(player[this.layer].level[i].mul(tmp[this.layer].boosterMulti).pow(tmp[this.layer].boosterExponent))
            if(tmp[this.layer].boosterExponent.eq(0)) eff[i]=new Decimal(1)
    	}
    	return eff;
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
        11: {
            description: "Add 1 to boosters effect exponent.",
            unlocked() { return EtUpgPage*3-2 <= this.id/10 && this.id/10 < EtUpgPage*3+1 },
            cost() {
                let cost = new Decimal(1)
                return cost
            },
            currencyDisplayName() {
                return "RP"
            },
            currencyLocation() {
                return player[this.layer]
            },
            currencyInternalName() {
                return "rp"
            },
        },
        12: {
            description: "Add 0.5 to boosters effect exponent.",
            unlocked() { return EtUpgPage*3-2 <= this.id/10 && this.id/10 < EtUpgPage*3+1 },
            cost() {
                let cost = new Decimal(2)
                return cost
            },
            currencyDisplayName() {
                return "RP"
            },
            currencyLocation() {
                return player[this.layer]
            },
            currencyInternalName() {
                return "rp"
            },
        },
        13: {
            description: "Eternity Power *2.",
            unlocked() { return EtUpgPage*3-2 <= this.id/10 && this.id/10 < EtUpgPage*3+1 },
            cost() {
                let cost = new Decimal(2)
                return cost
            },
            currencyDisplayName() {
                return "RP"
            },
            currencyLocation() {
                return player[this.layer]
            },
            currencyInternalName() {
                return "rp"
            },
        },
        14: {
            description: "Auto buy C upgrades.",
            unlocked() { return EtUpgPage*3-2 <= this.id/10 && this.id/10 < EtUpgPage*3+1 },
            cost() {
                let cost = new Decimal(10)
                return cost
            },
            currencyDisplayName() {
                return "RP"
            },
            currencyLocation() {
                return player[this.layer]
            },
            currencyInternalName() {
                return "rp"
            },
        },
        21: {
            description: "Auto do layer 2 resets.",
            unlocked() { return EtUpgPage*3-2 <= this.id/10 && this.id/10 < EtUpgPage*3+1 },
            cost() {
                let cost = new Decimal(40)
                return cost
            },
            currencyDisplayName() {
                return "CP Booster Levels"
            },
            currencyLocation() {
                return player[this.layer].level
            },
            currencyInternalName() {
                return "cp"
            },
        },
        22: {
            description: "Null Points increase booster exponent.",
            unlocked() { return EtUpgPage*3-2 <= this.id/10 && this.id/10 < EtUpgPage*3+1 },
            cost() {
                let cost = new Decimal(750)
                return cost
            },
            currencyDisplayName() {
                return "NP Booster Levels"
            },
            currencyLocation() {
                return player[this.layer].level
            },
            currencyInternalName() {
                return "np"
            },
            effect() {
                return player.points.add(8).slog()
            },
            effectDisplay() {
                return "+" + format(upgradeEffect(this.layer, this.id))
            }
        },
        23: {
            description: "RP increase booster exponent.",
            unlocked() { return EtUpgPage*3-2 <= this.id/10 && this.id/10 < EtUpgPage*3+1 },
            cost() {
                let cost = new Decimal(15)
                return cost
            },
            currencyDisplayName() {
                return "RP"
            },
            currencyLocation() {
                return player[this.layer]
            },
            currencyInternalName() {
                return "rp"
            },
            effect() {
                return player[this.layer].rp.add(1).ln().add(1).ln()
            },
            effectDisplay() {
                return "+" + format(upgradeEffect(this.layer, this.id))
            }
        },
        24: {
            description: "RP increase RP gain.",
            unlocked() { return EtUpgPage*3-2 <= this.id/10 && this.id/10 < EtUpgPage*3+1 },
            cost() {
                let cost = new Decimal(20)
                return cost
            },
            currencyDisplayName() {
                return "RP"
            },
            currencyLocation() {
                return player[this.layer]
            },
            currencyInternalName() {
                return "rp"
            },
            effect() {
                return player[this.layer].rp.add(1).ln().mul(0.02).add(1)
            },
            effectDisplay() {
                return "x" + format(upgradeEffect(this.layer, this.id))
            }
        },
        31: {
            description: "You get 10x inf points.",
            unlocked() { return EtUpgPage*3-2 <= this.id/10 && this.id/10 < EtUpgPage*3+1 },
            cost() {
                let cost = new Decimal(40)
                return cost
            },
            currencyDisplayName() {
                return "RP"
            },
            currencyLocation() {
                return player[this.layer]
            },
            currencyInternalName() {
                return "rp"
            },
        },
        32: {
            description: "Auto get 100% CP every second.",
            unlocked() { return EtUpgPage*3-2 <= this.id/10 && this.id/10 < EtUpgPage*3+1 },
            cost() {
                let cost = new Decimal(50)
                return cost
            },
            currencyDisplayName() {
                return "RP"
            },
            currencyLocation() {
                return player[this.layer]
            },
            currencyInternalName() {
                return "rp"
            },
        },
        33: {
            description: "Auto buy S upgrades.",
            unlocked() { return EtUpgPage*3-2 <= this.id/10 && this.id/10 < EtUpgPage*3+1 },
            cost() {
                let cost = new Decimal(60)
                return cost
            },
            currencyDisplayName() {
                return "RP"
            },
            currencyLocation() {
                return player[this.layer]
            },
            currencyInternalName() {
                return "rp"
            },
        },
        34: {
            description: "Get 50% star every second.",
            unlocked() { return EtUpgPage*3-2 <= this.id/10 && this.id/10 < EtUpgPage*3+1 },
            cost() {
                let cost = new Decimal(60)
                return cost
            },
            currencyDisplayName() {
                return "RP"
            },
            currencyLocation() {
                return player[this.layer]
            },
            currencyInternalName() {
                return "rp"
            },
        },
        41: {
            description: "Auto buy S Buyables.",
            unlocked() { return EtUpgPage*3-2 <= this.id/10 && this.id/10 < EtUpgPage*3+1 },
            cost() {
                let cost = new Decimal(75)
                return cost
            },
            currencyDisplayName() {
                return "RP"
            },
            currencyLocation() {
                return player[this.layer]
            },
            currencyInternalName() {
                return "rp"
            },
        },
        42: {
            description: "Keep P upgrades when resetting.",
            unlocked() { return EtUpgPage*3-2 <= this.id/10 && this.id/10 < EtUpgPage*3+1 },
            cost() {
                let cost = new Decimal(90)
                return cost
            },
            currencyDisplayName() {
                return "RP"
            },
            currencyLocation() {
                return player[this.layer]
            },
            currencyInternalName() {
                return "rp"
            },
        },
        43: {
            description: "RP increases eternity power.",
            unlocked() { return EtUpgPage*3-2 <= this.id/10 && this.id/10 < EtUpgPage*3+1 },
            cost() {
                let cost = new Decimal(100)
                return cost
            },
            currencyDisplayName() {
                return "RP"
            },
            currencyLocation() {
                return player[this.layer]
            },
            currencyInternalName() {
                return "rp"
            },
        },
        44: {
            description: "Effect of infinity upgrade 41 becomes x1e42.",
            unlocked() { return EtUpgPage*3-2 <= this.id/10 && this.id/10 < EtUpgPage*3+1 },
            cost() {
                let cost = new Decimal(160)
                return cost
            },
            currencyDisplayName() {
                return "RP"
            },
            currencyLocation() {
                return player[this.layer]
            },
            currencyInternalName() {
                return "rp"
            },
        },
        51: {
            description: "Unlocks Sacrifice in S.",
            unlocked() { return EtUpgPage*3-2 <= this.id/10 && this.id/10 < EtUpgPage*3+1 },
            cost() {
                let cost = new Decimal(200)
                return cost
            },
            currencyDisplayName() {
                return "RP"
            },
            currencyLocation() {
                return player[this.layer]
            },
            currencyInternalName() {
                return "rp"
            },
        },
        52: {
            description: "Energy boosts Eternity Power",
            unlocked() { return EtUpgPage*3-2 <= this.id/10 && this.id/10 < EtUpgPage*3+1 },
            cost() {
                let cost = new Decimal(300)
                return cost
            },
            currencyDisplayName() {
                return "RP"
            },
            currencyLocation() {
                return player[this.layer]
            },
            currencyInternalName() {
                return "rp"
            },
            effect() {
                return expSoftCap(player["s"].energy.add(1).ln().add(1), new Decimal(10), 2)
                //return new Decimal(1)
            },
            effectDisplay() {
                return "x" + format(upgradeEffect(this.layer, this.id))
            },
        },
        53: {
            description: "Booster exponent +1.5",
            unlocked() { return EtUpgPage*3-2 <= this.id/10 && this.id/10 < EtUpgPage*3+1 },
            cost() {
                let cost = new Decimal(2000)
                return cost
            },
            currencyDisplayName() {
                return "RP"
            },
            currencyLocation() {
                return player[this.layer]
            },
            currencyInternalName() {
                return "rp"
            },
        },
        54: {
            description: "Eternity Power becomes ^1.05",
            unlocked() { return EtUpgPage*3-2 <= this.id/10 && this.id/10 < EtUpgPage*3+1 },
            cost() {
                let cost = new Decimal(5000)
                return cost
            },
            currencyDisplayName() {
                return "RP"
            },
            currencyLocation() {
                return player[this.layer]
            },
            currencyInternalName() {
                return "rp"
            },
        },
        61: {
            description: "Sacrifice uses better formula.",
            unlocked() { return EtUpgPage*3-2 <= this.id/10 && this.id/10 < EtUpgPage*3+1 },
            cost() {
                let cost = new Decimal(10000)
                return cost
            },
            currencyDisplayName() {
                return "RP"
            },
            currencyLocation() {
                return player[this.layer]
            },
            currencyInternalName() {
                return "rp"
            },
        },
        62: {
            description: "Earth points becomes cheaper.",
            unlocked() { return EtUpgPage*3-2 <= this.id/10 && this.id/10 < EtUpgPage*3+1 },
            cost() {
                let cost = new Decimal(12000)
                return cost
            },
            currencyDisplayName() {
                return "RP"
            },
            currencyLocation() {
                return player[this.layer]
            },
            currencyInternalName() {
                return "rp"
            },
        },
        63: {
            description: "Row 2 points boosts RP gain.",
            unlocked() { return EtUpgPage*3-2 <= this.id/10 && this.id/10 < EtUpgPage*3+1 },
            cost() {
                let cost = new Decimal(15000)
                return cost
            },
            currencyDisplayName() {
                return "RP"
            },
            currencyLocation() {
                return player[this.layer]
            },
            currencyInternalName() {
                return "rp"
            },
            effect() {
            	var tot = new Decimal(0)
            	let row2 = ["a","f","e","w"];
            	for(var i in row2) {
            		tot = tot.add(player[row2[i]].points)
            	}
                return tot.mul(0.005).add(1).ln().add(1).pow(2)
                //return new Decimal(1)
            },
            effectDisplay() {
                return "x" + format(upgradeEffect(this.layer, this.id))
            },
        },
        64: {
            description: "Unlock energy and planet booster.",
            unlocked() { return EtUpgPage*3-2 <= this.id/10 && this.id/10 < EtUpgPage*3+1 },
            cost() {
                let cost = new Decimal(17500)
                return cost
            },
            currencyDisplayName() {
                return "RP"
            },
            currencyLocation() {
                return player[this.layer]
            },
            currencyInternalName() {
                return "rp"
            },
        },
        71: {
            description: "Booster Exponent +2.",
            unlocked() { return EtUpgPage*3-2 <= this.id/10 && this.id/10 < EtUpgPage*3+1 },
            cost() {
                let cost = new Decimal(250000)
                return cost
            },
            currencyDisplayName() {
                return "RP"
            },
            currencyLocation() {
                return player[this.layer]
            },
            currencyInternalName() {
                return "rp"
            },
        },
        72: {
            description: "Booster Exponent +2.",
            unlocked() { return EtUpgPage*3-2 <= this.id/10 && this.id/10 < EtUpgPage*3+1 },
            cost() {
                let cost = new Decimal(7654)
                return cost
            },
            currencyDisplayName() {
                return "Energy Booster Level"
            },
            currencyLocation() {
                return player[this.layer].level
            },
            currencyInternalName() {
                return "eg"
            },
        },
        73: {
            description: "Booster Exponent *1.5",
            unlocked() { return EtUpgPage*3-2 <= this.id/10 && this.id/10 < EtUpgPage*3+1 },
            cost() {
                let cost = new Decimal(200000)
                return cost
            },
            currencyDisplayName() {
                return "CP Booster Level"
            },
            currencyLocation() {
                return player[this.layer].level
            },
            currencyInternalName() {
                return "cp"
            },
        },
        74: {
            description: "Total booster levels increases Booster Exponent.",
            unlocked() { return EtUpgPage*3-2 <= this.id/10 && this.id/10 < EtUpgPage*3+1 },
            cost() {
                let cost = new Decimal(1500000)
                return cost
            },
            currencyDisplayName() {
                return "NP Booster Level"
            },
            currencyLocation() {
                return player[this.layer].level
            },
            currencyInternalName() {
                return "np"
            },
            effect() {
            	var tot = new Decimal(0)
            	let bst = ["np","cp","eg","pl"];
            	for(var i in bst) {
            		tot = tot.add(player["et"].level[bst[i]])
            	}
                return tot.add(1).ln().mul(0.5).add(1)
                //return new Decimal(1)
            },
            effectDisplay() {
                return "+" + format(upgradeEffect(this.layer, this.id))
            },
        },
        81: {
            description: "Booster Exponent *1.5",
            unlocked() { return EtUpgPage*3-2 <= this.id/10 && this.id/10 < EtUpgPage*3+1 },
            cost() {
                let cost = new Decimal(400000)
                return cost
            },
            currencyDisplayName() {
                return "RP"
            },
            currencyLocation() {
                return player[this.layer]
            },
            currencyInternalName() {
                return "rp"
            },
        },
        82: {
            description: "Total Booster level boost Eternity Power",
            unlocked() { return EtUpgPage*3-2 <= this.id/10 && this.id/10 < EtUpgPage*3+1 },
            cost() {
                let cost = new Decimal(500000)
                return cost
            },
            currencyDisplayName() {
                return "RP"
            },
            currencyLocation() {
                return player[this.layer]
            },
            currencyInternalName() {
                return "rp"
            },
            effect() {
            	var tot = new Decimal(0)
            	let bst = ["np","cp","eg","pl"];
            	for(var i in bst) {
            		tot = tot.add(player["et"].level[bst[i]])
            	}
                return tot.add(1).ln().pow(0.95).add(1)
                //return new Decimal(1)
            },
            effectDisplay() {
                return "x" + format(upgradeEffect(this.layer, this.id))
            },
        },
        83: {
            description: "RP increase Booster Exponent again",
            unlocked() { return EtUpgPage*3-2 <= this.id/10 && this.id/10 < EtUpgPage*3+1 },
            cost() {
                let cost = new Decimal(6e6)
                return cost
            },
            currencyDisplayName() {
                return "RP"
            },
            currencyLocation() {
                return player[this.layer]
            },
            currencyInternalName() {
                return "rp"
            },
            effect() {
            	return player[this.layer].rp.add(1).ln().mul(1.1)
                //return new Decimal(1)
            },
            effectDisplay() {
                return "+" + format(upgradeEffect(this.layer, this.id))
            },
        },
        84: {
            description: "Booster Exponent *1.5",
            unlocked() { return EtUpgPage*3-2 <= this.id/10 && this.id/10 < EtUpgPage*3+1 },
            cost() {
                let cost = new Decimal(300000)
                return cost
            },
            currencyDisplayName() {
                return "Planet Booster levels"
            },
            currencyLocation() {
                return player[this.layer].level
            },
            currencyInternalName() {
                return "pl"
            },
        },
        91: {
            description: "RP boost RP gain again.",
            unlocked() { return EtUpgPage*3-2 <= this.id/10 && this.id/10 < EtUpgPage*3+1 },
            cost() {
                let cost = new Decimal(50000)
                return cost
            },
            currencyDisplayName() {
                return "Energy Booster levels"
            },
            currencyLocation() {
                return player[this.layer].level
            },
            currencyInternalName() {
                return "eg"
            },
            effect() {
            	return player[this.layer].rp.add(1).ln().mul(0.05).add(1)
                //return new Decimal(1)
            },
            effectDisplay() {
                return "x" + format(upgradeEffect(this.layer, this.id))
            },
        },
        92: {
            description: "Sacrifice uses another better formula.",
            unlocked() { return EtUpgPage*3-2 <= this.id/10 && this.id/10 < EtUpgPage*3+1 },
            cost() {
                let cost = new Decimal(1.19999999999e7)
                return cost
            },
            currencyDisplayName() {
                return "RP"
            },
            currencyLocation() {
                return player[this.layer]
            },
            currencyInternalName() {
                return "rp"
            },
        },
        93: {
            description: "Energy Generator #4 becomes much cheaper.",
            unlocked() { return EtUpgPage*3-2 <= this.id/10 && this.id/10 < EtUpgPage*3+1 },
            cost() {
                let cost = new Decimal(1.29999999999e7)
                return cost
            },
            currencyDisplayName() {
                return "RP"
            },
            currencyLocation() {
                return player[this.layer]
            },
            currencyInternalName() {
                return "rp"
            },
        },
        94: {
            description: "Booster Exponent x8.88",
            unlocked() { return EtUpgPage*3-2 <= this.id/10 && this.id/10 < EtUpgPage*3+1 },
            cost() {
                let cost = new Decimal(2e7)
                return cost
            },
            currencyDisplayName() {
                return "RP"
            },
            currencyLocation() {
                return player[this.layer]
            },
            currencyInternalName() {
                return "rp"
            },
        },
    },
    buyables: {
        11: {
            title: "Double Levels!", // Optional, displayed at the top in a larger font
            cost(x) { // cost for buying xth buyable, can be an object if there are multiple currencies
                let cost = (new Decimal(10)).mul((new Decimal(1.3)).add(x.div(10)).pow(x))
                return cost.floor()
            },
            effect(x) { // Effects of owning x of the items, x is a decimal
                let eff = x.mul(0.001).pow(0.5)
                return eff;
            },
            display() { // Everything else displayed in the buyable button after the title
                let data = tmp[this.layer].buyables[this.id]
                return (
                "Cost: " + format(data.cost) + " RP\n\
                You have a " + format(data.effect.mul(100)) + "% chance to get 2x levels when finishing a booster bar.\n\
                Next: " + format((player[this.layer].buyables[this.id].add(1)).mul(10).pow(0.5)) +"%<br/>" +
                format(player[this.layer].buyables[this.id], 0) + " / 1000"
                )
                //return "Oops!"
            },
            unlocked() { return true }, 
            canAfford() {
                return player[this.layer].rp.gte(tmp[this.layer].buyables[this.id].cost)
            },
            buy() { 
                cost = tmp[this.layer].buyables[this.id].cost
                player[this.layer].rp = player[this.layer].rp.sub(cost) 
                player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(1)
                //player[this.layer].spentOnBuyables = player[this.layer].spentOnBuyables.add(cost) // This is a built-in system that you can use for respeccing but it only works with a single Decimal value
            },
            purchaseLimit: new Decimal(1000),
        },
        12: {
            title: "Triple Levels!", // Optional, displayed at the top in a larger font
            cost(x) { // cost for buying xth buyable, can be an object if there are multiple currencies
                let cost = (new Decimal(20)).mul((new Decimal(1.5)).add(x.div(10)).pow(x))
                return cost.floor()
            },
            effect(x) { // Effects of owning x of the items, x is a decimal
                let eff = player[this.layer].buyables[this.id].mul(0.001).pow(0.5)
                return eff;
            },
            display() { // Everything else displayed in the buyable button after the title
                let data = tmp[this.layer].buyables[this.id]
                return (
                "Cost: " + format(data.cost) + " CP Booster Level\n\
                You have a " + format(data.effect.mul(100)) + "% chance to get 3x levels when finishing a booster bar.\n\
                Next: " + format((player[this.layer].buyables[this.id].add(1)).mul(10).pow(0.5)) +"%<br/>" +
                format(player[this.layer].buyables[this.id], 0) + " / 1000"
                )
                //return "Oops!"
            },
            unlocked() { return true }, 
            canAfford() {
                return player[this.layer].level.cp.gte(tmp[this.layer].buyables[this.id].cost)
            },
            buy() { 
                cost = tmp[this.layer].buyables[this.id].cost
                player[this.layer].level.cp = player[this.layer].level.cp.sub(cost) 
                player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(1)
                //player[this.layer].spentOnBuyables = player[this.layer].spentOnBuyables.add(cost) // This is a built-in system that you can use for respeccing but it only works with a single Decimal value
            },
            purchaseLimit: new Decimal(1000),
        },
    },
    bars: {
    	np: {
        	direction: RIGHT,
        	width: 400,
       		height: 50,
        	progress() { return player[this.layer].progress["np"] },
        	display() {
        		let ret = "Eternity Null Points Booster<br/>Levels: " + format(player[this.layer].level.np) + "(x" + format(tmp[this.layer].getEffect[this.id]) + ")"
        		return ret;
        	},
        	unlocked() {return true;},
        	fillStyle: {'background-color' : "#BBBBBB"},
            baseStyle: {'background-color' : "#494949"},
            instant: true,
        },
        cp: {
        	direction: RIGHT,
        	width: 400,
       		height: 50,
        	progress() { return player[this.layer].progress["cp"] },
        	display() {
        		let ret = "Eternity Compressed Null Points Booster<br/>Levels: " + format(player[this.layer].level.cp) + "(x" + format(tmp[this.layer].getEffect[this.id]) + ")"
        		return ret;
        	},
        	unlocked() {return true;},
        	fillStyle: {'background-color' : "#888888"},
            baseStyle: {'background-color' : "#494949"},
            instant: true,
        },
        pl: {
        	direction: RIGHT,
        	width: 400,
       		height: 50,
        	progress() { return player[this.layer].progress["pl"] },
        	display() {
        		let ret = "Eternity Planet Booster<br/>Levels: " + format(player[this.layer].level.pl) + "(x" + format(tmp[this.layer].getEffect[this.id]) + ")"
        		return ret;
        	},
        	unlocked() {return hasUpgrade(this.layer, "64")},
        	fillStyle: {'background-color' : "#11ffcc"},
            baseStyle: {'background-color' : "#494949"},
            instant: true,
        },
        eg: {
        	direction: RIGHT,
        	width: 400,
       		height: 50,
        	progress() { return player[this.layer].progress["eg"] },
        	display() {
        		let ret = "Eternity Energy Booster<br/>Levels: " + format(player[this.layer].level.eg) + "(x" + format(tmp[this.layer].getEffect[this.id]) + ")"
        		return ret;
        	},
        	unlocked() {return hasUpgrade(this.layer, "64")},
        	fillStyle: {'background-color' : "#cccd22"},
            baseStyle: {'background-color' : "#494949"},
            instant: true,
        },
        rp: {
            direction: RIGHT,
            width: 400,
            height: 50,
            progress() { return player[this.layer].progress["rp"] },
            display() {
                let ret = "Fill this bar to get one RP!"
                return ret;
            },
            unlocked() {return true;},
            fillStyle: {'background-color' : "#99cc99"},
            baseStyle: {'background-color' : "#494949"},
            instant: true,
        },
    },
    update(time) {
    	let pow = tmp[this.layer].getPow
    	let cnt = 0
    	for(i in player[this.layer].stats){
    		if(player[this.layer].stats[i]) {
    			cnt++;
    		}
    	}
    	if(cnt==0){
    		return
    	}
    	pow=pow.div(cnt).mul(time)
    	if(player[this.layer].stats["np"]){
    		let prg=player[this.layer].progress.np
    		prg=prg.add(pow)

            let dL=prg.floor()
            if(Math.random() < buyableEffect("et", 11)) dL = dL.mul(2)
            if(Math.random() < buyableEffect("et", 12)) dL = dL.mul(3)

    		player[this.layer].level.np=player[this.layer].level.np.add(dL)
    		prg=prg.sub(prg.floor())
    		player[this.layer].progress.np=prg
    	}
    	if(player[this.layer].stats["cp"]){
    		let prg=player[this.layer].progress.cp
    		prg=prg.add(pow.div(10))

            let dL=prg.floor()
            if(Math.random() < buyableEffect("et", 11)) dL = dL.mul(2)
            if(Math.random() < buyableEffect("et", 12)) dL = dL.mul(3)

    		player[this.layer].level.cp=player[this.layer].level.cp.add(dL)
    		prg=prg.sub(prg.floor())
    		player[this.layer].progress.cp=prg
    	}
    	if(player[this.layer].stats["pl"]){
    		let prg=player[this.layer].progress.pl
    		prg=prg.add(pow.div(100))

            let dL=prg.floor()
            if(Math.random() < buyableEffect("et", 11)) dL = dL.mul(2)
            if(Math.random() < buyableEffect("et", 12)) dL = dL.mul(3)

    		player[this.layer].level.pl=player[this.layer].level.pl.add(dL)
            prg=prg.sub(prg.floor())
    		player[this.layer].progress.pl=prg
    	}
    	if(player[this.layer].stats["eg"]){
    		let prg=player[this.layer].progress.eg
    		prg=prg.add(pow.div(1000))

            let dL=prg.floor()
            if(Math.random() < buyableEffect("et", 11)) dL = dL.mul(2)
            if(Math.random() < buyableEffect("et", 12)) dL = dL.mul(3)

    		player[this.layer].level.eg=player[this.layer].level.eg.add(dL)
    		prg=prg.sub(prg.floor())
    		player[this.layer].progress.eg=prg
    	}
        if(player[this.layer].stats["rp"]){
            let prg=player[this.layer].progress.rp
            prg=prg.add(pow.div(15))

            let dL=prg.floor()
            if(Math.random() < buyableEffect("et", 11)) dL = dL.mul(2)
            if(Math.random() < buyableEffect("et", 12)) dL = dL.mul(3)
            if(hasUpgrade("et", 24)) dL = dL.mul(upgradeEffect(this.layer, 24))
            if(hasUpgrade("et", 91)) dL = dL.mul(upgradeEffect(this.layer, 91))

            player[this.layer].rp=player[this.layer].rp.add(dL)
            prg=prg.sub(prg.floor())
            player[this.layer].progress.rp=prg
        }
    },
    tabFormat: {
        "Upgrades": {
            content: [
                "main-display", 
                "prestige-button", 
                "blank",
                ["display-text", function(){
                    return "You have " + format(player[this.layer].rp) + " Research Points(RP)."
                }],
                "blank",
                ["display-text", function(){
                    return "Page " + EtUpgPage + "/" + EtMaxUpgPage
                }],
                "blank",
                ["row",[
                    "upgrades",
                    ["column",[["clickable", 21],["clickable", 22]]],
                    ["column",[["clickable", 23],["clickable", 24]]],
                ]],
                "blank",
                "buyables",
            ],
        },
        "Boosters": {
            content: [
            	"main-display", 
                ["display-text", function(){
                	return "These ep provides u " + format(tmp[this.layer].getPow) + " power.<br/>formula: "
                    + (hasUpgrade("et", 13)? "2*" : "")
                    + "log<sub>2</sub>([max ep]"
                    + (hasUpgrade("et", 43)? " + RP<sup>0.5</sup>" : "")
                    + ") * log<sub>2</sub>([max ep])<sup>3</sup>"
                }],
                "blank",
                ["display-text", function(){
                    return "You have " + format(player[this.layer].rp) + " Research Points(RP)."
                }],
                "blank",
                "prestige-button", 
                "blank",
                ["row",[["clickable",11],"blank",["bar", "np"]]],
                ["row",[["clickable",12],"blank",["bar", "cp"]]],
                ["row",[["clickable",13],"blank",["bar", "pl"]]],
                ["row",[["clickable",14],"blank",["bar", "eg"]]],
                ["row",[["clickable",15],"blank",["bar", "rp"]]],
            ],
        },
    },
    clickables: {
        11: {
            display() {
                let tmpString = "Assign power to np booster.<br>Currently: "
                if(player[this.layer].stats.np) tmpString = tmpString + "On"
                else tmpString = tmpString + "Off"
                return tmpString
            },
            onClick() {
                player[this.layer].stats.np = !player[this.layer].stats.np
            },
            canClick() {
                return true
            },
            style() {
                if(player[this.layer].stats.np) return {"background-color": "#33ff33", "color": "black", "height":"60px", "width":"120px"}
                else return {"background-color": "#af5f5f", "color": "black", "height":"60px", "width":"120px"}
            },
        },
        12: {
            display() {
                let tmpString = "Assign power to cp booster.<br>Currently: "
                if(player[this.layer].stats.cp) tmpString = tmpString + "On"
                else tmpString = tmpString + "Off"
                return tmpString
            },
            onClick() {
                player[this.layer].stats.cp = !player[this.layer].stats.cp
            },
            canClick() {
                return true
            },
            style() {
                if(player[this.layer].stats.cp) return {"background-color": "#33ff33", "color": "black", "height":"60px", "width":"120px"}
                else return {"background-color": "#af5f5f", "color": "black", "height":"60px", "width":"120px"}
            },
        },
        13: {
            display() {
                let tmpString = "Assign power to planet booster.<br>Currently: "
                if(player[this.layer].stats.pl) tmpString = tmpString + "On"
                else tmpString = tmpString + "Off"
                return tmpString
            },
            onClick() {
                player[this.layer].stats.pl = !player[this.layer].stats.pl
            },
            canClick() {
                return true
            },
            style() {
                if(player[this.layer].stats.pl) return {"background-color": "#33ff33", "color": "black", "height":"100px", "width":"120px"}
                else return {"background-color": "#af5f5f", "color": "black", "height":"100px", "width":"120px"}
            },
        	unlocked() {return hasUpgrade(this.layer, "64")},
        },
        14: {
            display() {
                let tmpString = "Assign power to energy booster.<br>Currently: "
                if(player[this.layer].stats.eg) tmpString = tmpString + "On"
                else tmpString = tmpString + "Off"
                return tmpString
            },
            onClick() {
                player[this.layer].stats.eg = !player[this.layer].stats.eg
            },
            canClick() {
                return true
            },
            style() {
                if(player[this.layer].stats.eg) return {"background-color": "#33ff33", "color": "black", "height":"100px", "width":"120px"}
                else return {"background-color": "#af5f5f", "color": "black", "height":"100px", "width":"120px"}
            },
        	unlocked() {return hasUpgrade(this.layer, "64")},
        },
        15: {
            display() {
                let tmpString = "Assign power to RP generator.<br>Currently: "
                if(player[this.layer].stats.rp) tmpString = tmpString + "On"
                else tmpString = tmpString + "Off"
                return tmpString
            },
            onClick() {
                player[this.layer].stats.rp = !player[this.layer].stats.rp
            },
            canClick() {
                return true
            },
            style() {
                if(player[this.layer].stats.rp) return {"background-color": "#33ff33", "color": "black", "height":"100px", "width":"120px"}
                else return {"background-color": "#af5f5f", "color": "black", "height":"100px", "width":"120px"}
            },
        },
        21: {
            display() {
                return "<"
            },
            onClick() {
                if(EtUpgPage > 1) EtUpgPage -= 1
            },
            canClick() {
                return true
            },
            style() {
                return {"background-color": "#cccccc", "color": "black", "height":"100px", "width":"50px"}
            },
        },
        22: {
            display() {
                return "<<"
            },
            onClick() {
                EtUpgPage = 1
            },
            canClick() {
                return true
            },
            style() {
                return {"background-color": "#cccccc", "color": "black", "height":"100px", "width":"50px"}
            },
        },
        23: {
            display() {
                return ">"
            },
            onClick() {
                if(EtUpgPage < EtMaxUpgPage) EtUpgPage += 1
            },
            canClick() {
                return true
            },
            style() {
                return {"background-color": "#cccccc", "color": "black", "height":"100px", "width":"50px"}
            },
        },
        24: {
            display() {
                return ">>"
            },
            onClick() {
                EtUpgPage = EtMaxUpgPage
            },
            canClick() {
                return true
            },
            style() {
                return {"background-color": "#cccccc", "color": "black", "height":"100px", "width":"50px"}
            },
        },
    }
})
