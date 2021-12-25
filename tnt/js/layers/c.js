var cpCap = new Decimal("1.8e308")
var lnCpDecreaseRate = (new Decimal(0.05)).ln()

addLayer("c", {
    name: "compress", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "C", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,
		points: new Decimal(0),
        resetTime: 0,
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
        mult = mult.mul(buyableEffect("f", 11))
        if(hasUpgrade(this.layer, 41)) mult = mult.mul(upgradeEffect(this.layer, 41))
        let tmpp = ["e","f","w","a"]
        for(let i = 0; i < 4; i++)if(hasMilestone(tmpp[i], 2)) {
            let eff = (new Decimal(2)).pow(player[tmpp[i]].best)
            if(eff.gt(1e9)) eff = eff.sub(1e9).add(1).pow(0.4).add(1e9)
            mult = mult.mul(eff)
        }
        if(hasUpgrade(this.layer, 44)) mult = mult.mul(upgradeEffect(this.layer, 44))
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        let exp = new Decimal(1)
        if(hasUpgrade("inf", 11)) exp = exp.mul(1.1)
        return exp
    },
    row: 0, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
        {key: "c", description: "C: Reset for compressed null points", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    layerShown(){return true},
    midsection: [
        ["display-text", function(){
            if(player["c"].points.lt(cpCap)) return ""
            return "CP above " + format(cpCap) + " are unstable. " + format((new Decimal(100)).sub(lnCpDecreaseRate.exp().mul(100))) + "% of them disappear every second."
        }],
    ],
    softcap() {
        if(hasUpgrade("c", 34)) {
            if(hasUpgrade("inf", 44)) return new Decimal("1.8e308")
            return new Decimal("1.8e308")
        }
        return new Decimal("1e33")
    },
    softcapPower() {
        if(hasUpgrade("c", 34)) {
            if(hasUpgrade("inf", 44)) return new Decimal("0.25")
            return (new Decimal("e-1000"))
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
            description : "Multiply np gain based on your np.",
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
            description : "Multiply np gain based on your compressed null point(cp).",
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
        },
        41 : {
            description : "Multiplies cp gain based on np.",
            cost() {
                let cost = (new Decimal("1e65"))
                cost = cost.mul(buyableEffect("a", 11))
                return cost
            },
            effect() {
                let eff = (new Decimal(1)).add(player.points.add(1).ln().pow(2))
                if(eff.gt(1e8)) eff = eff.sub(1e8).add(1).ln().add(1e8)
                return eff
                //return new Decimal(1)
            },
            effectDisplay() {
                return format(upgradeEffect(this.layer, this.id)) + "x"
            },
            unlocked() {
                return hasMilestone("w", 0)
            }
        },
        42 : {
            description : "Multiplies np gain based on time since last reset.",
            cost() {
                let cost = (new Decimal("e86"))
                cost = cost.mul(buyableEffect("a", 11))
                return cost
            },
            effect() {
                let eff = (new Decimal(player[this.layer].resetTime)).exp().pow(0.5)
                if(eff.gte(1e8)) eff = eff.sub(1e8).add(1).pow(0.25).add(1e8)
                if(eff.gte(1e16)) eff = eff.sub(1e16).add(1).pow(0.25).add(1e16)
                if(eff.gte(1e24)) eff = eff.sub(1e24).add(1).pow(0.25).add(1e24)
                if(eff.gte(1e32)) eff = eff.sub(1e32).add(1).pow(0.25).add(1e32)
                return eff
                //return new Decimal(1)
            },
            effectDisplay() {
                return format(upgradeEffect(this.layer, this.id)) + "x"
            },
            unlocked() {
                return hasMilestone("w", 0)
            }
        },
        43 : {
            description : "Increases np gain based on your cp.",
            cost() {
                let cost = (new Decimal("e145"))
                cost = cost.mul(buyableEffect("a", 11))
                return cost
            },
            effect() {
                let eff = player[this.layer].points.add(1).ln().add(1).ln().add(1).ln().add(1).pow(0.225)
                if(eff.gt(2)) eff = eff.sub(2).add(1).pow(0.1).ln().add(2)
                return eff
                //return new Decimal(1)
            },
            effectDisplay() {
                return "^" + format(upgradeEffect(this.layer, this.id))
            },
            unlocked() {
                return hasMilestone("w", 0)
            }
        },
        44 : {
            description : "ip increases cp gain.",
            cost() {
                let cost = (new Decimal("e4740"))
                cost = cost.mul(buyableEffect("a", 11))
                return cost
            },
            effect() {
                let eff = player["inf"].points.pow(3.35)
                return eff
                //return new Decimal(1)
            },
            effectDisplay() {
                return "x" + format(upgradeEffect(this.layer, this.id))
            },
            unlocked() {
                return player.points.gte(new Decimal("e17000"))
            }
        },
    },
    autoUpgrade() {
        return hasMilestone("f", 0) && player["au"].autoCp
    },
    passiveGeneration() {
        let gen = new Decimal(0)
        if(hasMilestone("e", 0)) gen = new Decimal(0.02)
        if(hasAchievement("ac", 31)) gen = gen.mul(10)
        if(hasUpgrade("s", 14)) gen = gen.add(1e-34)
        return gen
    },
    update(diff) {
        if(player["c"].points.gte(cpCap)) player[this.layer].points = player[this.layer].points.sub(cpCap).mul((new Decimal(diff)).times(lnCpDecreaseRate).exp()).add(cpCap)
        let tmp = new Decimal(0.95)
        tmp = tmp.mul((new Decimal(0)).sub(challengeCompletions("inf", 11)).mul(.15).add(1).pow(2))
        tmp = (new Decimal(1)).sub(tmp)
        lnCpDecreaseRate = tmp.ln()
        if(inChallenge("inf", 12)) player[this.layer].points = player[this.layer].points.mul((new Decimal(diff)).times(((new Decimal(1)).sub(challengeCompletions("inf", 12)*0.195)).ln()).exp())
    },
    doReset(resettingLayer) {
        if(layers[resettingLayer].row == "side" || layers[resettingLayer].row <= this.row) return
        if((resettingLayer == "a" || resettingLayer == "e" || resettingLayer == "f" || resettingLayer == "w") && hasMilestone(resettingLayer, 1)) return
        layerDataReset(this.layer, [])
    }
})