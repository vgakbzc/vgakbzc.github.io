addLayer("c", {
    name: "compress", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "C", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,
		points: new Decimal(0),
    }},
    color: "#aaaaaa",
    requires: function(){
        req = new Decimal(16)
        if(hasUpgrade("c", 21)) {
            req = req.mul(0.5)
        }
        if(hasUpgrade("c", 32)) {
            req = req.mul(0.5)
        }
        return req
    }, // Can be a function that takes requirement increases into account
    resource: "compressed null points", // Name of prestige currency
    baseResource: "null points", // Name of resource prestige is based on
    baseAmount() {return player.points}, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: function(){
        exp = new Decimal(0.333333333)
        if(hasUpgrade("c", 32)) {
            exp = new Decimal(0.9)
        }
        else if(hasUpgrade("c", 31)) {
            exp = new Decimal(0.83)
        }
        else if(hasUpgrade("c", 23)) {
            exp = new Decimal(0.75)
        }
        else if(hasUpgrade("c", 22)) {
            exp = new Decimal(0.5)
        }
        return exp.add(buyableEffect("e", 11))
    }, // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
        mult.mul(buyableEffect("f", 11))
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
    row: 0, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
        {key: "c", description: "C: Reset for compressed null points", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    layerShown(){return true},
    softcap() {
        if(hasUpgrade("c", 34)) {
            return new Decimal("1.8e308")
        }
        return new Decimal("1e33")
    },
    softcapPower() {
        if(hasUpgrade("c", 34)) {
            return new Decimal("1e-1000")
        }
        return new Decimal("0.333333333")
    },
    upgrades : {
        11 : {
            name : "Get started",
            description : "Gain 1 null point(np) every second.",
            cost() {
                let cost = (new Decimal(0))
                cost = cost.mul(buyableEffect("a", 11))
                return cost
            },
        },
        12 : {
            name : "Null produces null",
            description : "Multiply effect of upgrade 11 based on your np.",
            cost() {
                let cost = (new Decimal(1))
                cost = cost.mul(buyableEffect("a", 11))
                return cost
            },
            effect() {
                eff = player.points.add(1).ln().mul(1.7).add(1)
                if(hasUpgrade("c", 14)) {
                    eff = player.points.add(1).ln().mul(1.7).mul(upgradeEffect("c", 14)).add(1)
                }
                if(hasUpgrade("c", 24)) {
                    eff = eff.mul(upgradeEffect("c", 24))
                }
                return eff
            },
            effectDisplay() {
                return format(upgradeEffect(this.layer, this.id)) + 'x'
            }
        },
        13 : {
            name : "Compressed is the best",
            description : "Multiply effect of upgrade 11 based on your compressed null point(cp).",
            cost() {
                let cost = (new Decimal(2))
                cost = cost.mul(buyableEffect("a", 11))
                return cost
            },
            effect() {
                eff = player[this.layer].points.add(1).pow(0.25)
                if(hasUpgrade("c", 14)) {
                    eff = player[this.layer].points.add(1).pow(0.6).add(-1).mul(upgradeEffect("c", 14)).add(1)
                }
                if(hasUpgrade("c", 24)) {
                    eff = eff.mul(upgradeEffect("c", 24))
                }
                return eff
            },
            effectDisplay() {
                return format(upgradeEffect(this.layer, this.id)) + "x"
            }
        },
        14 : {
            name : "Null produces more null",
            description : "Multiply effect of upgrade 12 and 13 based on your np.",
            cost() {
                let cost = (new Decimal(10))
                cost = cost.mul(buyableEffect("a", 11))
                return cost
            },
            effect() {
                eff = player.points.add(1).ln().add(1)
                if(hasUpgrade("c", 24)) {
                    eff = eff.mul(upgradeEffect("c", 24))
                }
                return eff
            },
            effectDisplay() {
                return format(upgradeEffect(this.layer, this.id)) + "x"
            }
        },
        21 : {
            name : "Better compressing",
            description : "Base np requirement to gain cp is 50% less.",
            cost() {
                let cost = (new Decimal(4))
                cost = cost.mul(buyableEffect("a", 11))
                return cost
            }
        },
        22 : {
            name : "Better^2 compressing",
            description : "Np required to get cp grows slower.",
            cost() {
                let cost = (new Decimal(20))
                cost = cost.mul(buyableEffect("a", 11))
                return cost
            }
        },
        23 : {
            name : "Better^3 compressing",
            description : "Np required to get cp grows MUCH slower.",
            cost() {
                let cost = (new Decimal(200))
                cost = cost.mul(buyableEffect("a", 11))
                return cost
            }
        },
        24 : {
            name : "Null produces more^2 null",
            description : "Multiply effect of upgrade 12 ~ 14 based on np.",
            cost() {
                let cost = (new Decimal(4888))
                cost = cost.mul(buyableEffect("a", 11))
                return cost
            },
            effect() {
                return player.points.add(1).ln().add(1).pow(1.05)
            },
            effectDisplay() {
                return format(upgradeEffect(this.layer, this.id)) + "x"
            }
        },
        31 : {
            name : "Better^4 compressing",
            description : "Np required to get cp grows MUCH^2 slower.",
            cost() {
                let cost = (new Decimal("e18"))
                cost = cost.mul(buyableEffect("a", 11))
                return cost
            }
        },
        32 : {
            name : "Better^5 compressing",
            description : "Base np requirement to gain cp is 50% less AGAIN.",
            cost() {
                let cost = (new Decimal(5.5555e22))
                cost = cost.mul(buyableEffect("a", 11))
                return cost
            }
        },
        33 : {
            description : "Multiply effect of upgrade based on your cp.",
            cost() {
                let cost = (new Decimal(1.71e28))
                cost = cost.mul(buyableEffect("a", 11))
                return cost
            },
            effect() {
                if(player[this.layer].points.lte(1e33)) return (new Decimal(1e5)).sub((new Decimal(1e33)).div(player[this.layer].points.add(1e33)).mul(99999))
                return new Decimal(1e5)
            },
            effectDisplay() {
                return format(upgradeEffect(this.layer, this.id)) + "x"
            }
        },
        34 : {
            description : "CP gain above 1e33 are raised to 3rd power.",
            cost() {
                let cost = (new Decimal(1.1111e35))
                cost = cost.mul(buyableEffect("a", 11))
                return cost
            }
        }
    },
    autoUpgrade() {
        return hasAchievement("ac", 31)
    },
    passiveGeneration() {
        if(hasMilestone("e", 0)) return 0.5
        return 0
    },
})