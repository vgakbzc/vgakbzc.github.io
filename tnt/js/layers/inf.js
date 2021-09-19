addLayer("inf", {
    //name: "Air", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "Inf", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    branches : ["c"],
    startData() { return {
        unlocked: false,
        points: new Decimal(0),
        total : new Decimal(0),
        best  : new Decimal(0),
        shown : false
    }},
    color: "#7fc19b",
    requires: function(){
        req = new Decimal("1.8e308")
        return req
    }, // Can be a function that takes requirement increases into account
    resource: "infinity points", // Name of prestige currency
    baseResource: "compressed null points", // Name of resource prestige is based on
    baseAmount() {return player["c"].points}, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: function(){
        return new Decimal(0.25)
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
        {key: "i", description: "I: Reset for infinity points", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    layerShown(){
        return player[this.layer].shown
    },
    checkIfInfinity(){
        if(player["c"].points.gte("1.8e308")){
            player[this.layer].shown = true
        }
    },
    upgrades: {
        11: {
            description : "cp gain becomes ^1.1",
            cost() {
                let cost = (new Decimal(1))
                return cost
            },
        },
        12: {
            description : "Best ip increases np gain.",
            cost() {
                let cost = new Decimal(1)
                return cost
            },
            effect() {
                let eff = (new Decimal(1)).sub(player[this.layer].best.pow(0.125).times(-0.35).exp()).pow(2).add(1)
                return eff
            },
            effectDisplay() {
                return "^" + format(upgradeEffect("inf", 12))
            },
            unlocked() {
                return hasUpgrade(this.layer, 11)
            }
        },
        13: {
            description : "Unlocks buy max in row 2.",
            cost() {
                let cost = new Decimal(2)
                return cost
            },
            unlocked() {
                return hasUpgrade(this.layer, 12)
            }
        },
        14: {
            description : "Keeps milestones of row 2 when resetting.",
            cost() {
                let cost = new Decimal(3)
                return cost
            },
            unlocked() {
                return hasUpgrade(this.layer, 13)
            }
        },
        21: {
            description : "Auto reset for ap.",
            cost() {
                let cost = new Decimal(3)
                return cost
            },
            unlocked() {
                return hasUpgrade(this.layer, 14)
            }
        },
        22: {
            description : "Auto reset for fp.",
            cost() {
                let cost = new Decimal(3)
                return cost
            },
            unlocked() {
                return hasUpgrade(this.layer, 14)
            }
        },
        23: {
            description : "Auto reset for ep.",
            cost() {
                let cost = new Decimal(3)
                return cost
            },
            unlocked() {
                return hasUpgrade(this.layer, 14)
            }
        },
        24: {
            description : "Auto reset for wp.",
            cost() {
                let cost = new Decimal(5)
                return cost
            },
            unlocked() {
                return hasUpgrade(this.layer, 14)
            }
        },
    },
    challenges: {
        11: {
            name: "EASY",
            challengeDescription() {
                if(maxedChallenge(this.layer, this.id)) return ""
                return "Your np gain becomes ^" + format((new Decimal(9)).sub(challengeCompletions(this.layer, this.id)).div(10).pow(0.75)) + "."
            },
            goalDescription() {
                if(maxedChallenge(this.layer, this.id)) return ""
                return "Get 1.80e308 cp."
            },
            rewardDescription() {
                if(maxedChallenge(this.layer, this.id)) return ""
                return "Your cp decrease rate becomes x" + format((new Decimal(0)).sub((new Decimal(challengeCompletions(this.layer, this.id))).add(1).mul(0.1)).add(1)) + "."
            },
            onEnter() {
                doReset(this.layer)
            },
            completionLimit: new Decimal(5),
            canComplete() {
                return player["c"].points.gte(new Decimal("1.8e308"))
            }
        }
    }
})
