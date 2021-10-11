let achievement31Unlocked = false

addLayer("ac", {
    name: "Achievements", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "Ac", // This appears on the layer's node. Default is the id with the first letter capitalized
    color: "#99ccaa",
    glowColor: "#99ccaa",
    shouldNotify() { 
        return true
    },
    resource: "achievement power (which gives you multiplier on points generation)", 
    row: "side",
    tooltip() { // Optional, tooltip displays when the layer is locked
        return ("Achievements")
    },
    startData() { return {
        unlocked: true,
		points: new Decimal(100),
    }},
    achievementPopups: true,
    achievements : {
        11 : {
            name: "You gotta start somewhere...",
            done() {return hasUpgrade("c", 11)}, // This one is a freebie
            goalTooltip: "Buy upgrade 11 in C.", // Shows when achievement is not completed
            doneTooltip: "Buy upgrade 11 in C.", // Showed when the achievement is completed
            onComplete() {
                player[this.layer].points = player[this.layer].points.mul(1.03);
            }
        },
        12 : {
            name: "Limit Break",
            done() {return hasUpgrade("c", 34)}, // This one is a freebie
            goalTooltip: "Buy upgrade 34 in C.", // Shows when achievement is not completed
            doneTooltip: "Buy upgrade 34 in C.", // Showed when the achievement is completed
            onComplete() {
                player[this.layer].points = player[this.layer].points.mul(1.03);
            }
        },
        13 : {
            name: "Effectively idle.",
            done() {return buyableEffect("id", 11).gt(1)}, // This one is a freebie
            goalTooltip: "Buy upgrade 11 in id.", // Shows when achievement is not completed
            doneTooltip: "Buy upgrade 11 in id.", // Showed when the achievement is completed
            onComplete() {
                player[this.layer].points = player[this.layer].points.mul(1.03);
            }
        },
        14 : {
            name: "One minute is a lot.",
            done() {return player["id"].points.gte(60)}, // This one is a freebie
            goalTooltip: "Have at least 60 seconds of inertia.", // Shows when achievement is not completed
            doneTooltip: "Have at least 60 seconds of inertia.", // Showed when the achievement is completed
            onComplete() {
                player[this.layer].points = player[this.layer].points.mul(1.03);
            }
        },
        21 : {
            name: "Air",
            done() {return player["a"].points.gte(1)}, // This one is a freebie
            goalTooltip: "Get an air point.", // Shows when achievement is not completed
            doneTooltip: "Get an air point.", // Showed when the achievement is completed
            onComplete() {
                player[this.layer].points = player[this.layer].points.mul(1.03);
            }
        },
        22 : {
            name: "Water",
            done() {return player["w"].points.gte(1)}, // This one is a freebie
            goalTooltip: "Get a water point.", // Shows when achievement is not completed
            doneTooltip: "Get a air point.", // Showed when the achievement is completed
            onComplete() {
                player[this.layer].points = player[this.layer].points.mul(1.03);
            }
        },
        23 : {
            name: "Earth",
            done() {return player["e"].points.gte(1)}, // This one is a freebie
            goalTooltip: "Get an earth point.", // Shows when achievement is not completed
            doneTooltip: "Get an earth point.", // Showed when the achievement is completed
            onComplete() {
                player[this.layer].points = player[this.layer].points.mul(1.03);
            }
        },
        24 : {
            name: "Fire",
            done() {return player["f"].points.gte(1)}, // This one is a freebie
            goalTooltip: "Get a fire point.", // Shows when achievement is not completed
            doneTooltip: "Get a fire point.", // Showed when the achievement is completed
            onComplete() {
                player[this.layer].points = player[this.layer].points.mul(1.03);
            }
        },
        31 : {
            name: "Pretty Rich",
            done() {return player.points.gte(6.66e68) && hasMilestone("e", 0)}, // This one is a freebie
            goalTooltip: "Get 6.66e68 null points.\nReward: Passive cp generation is multiplied by 10.", // Shows when achievement is not completed
            doneTooltip: "Get 6.66e68 null points.\nReward: Passive cp generation is multiplied by 10.", // Showed when the achievement is completed
            onComplete() {
                player[this.layer].points = player[this.layer].points.mul(1.03);
            },
            unlocked() {
                if(hasMilestone("e", 0)) achievement31Unlocked = true
                return achievement31Unlocked
            }
        },
        32 : {
            name: "Infinity isn't hard",
            done() {return player["c"].points.gte(new Decimal("1.8e308"))}, // This one is a freebie
            goalTooltip: "Get 1.8e308 cp.", // Shows when achievement is not completed
            doneTooltip: "Get 1.8e308 cp.", // Showed when the achievement is completed
            onComplete() {
                player[this.layer].points = player[this.layer].points.mul(1.03);
            },
        },
        33 : {
            name: "\"REAL\" automation",
            done() {return hasUpgrade("inf", 21) && hasUpgrade("inf", 22) && hasUpgrade("inf", 23) && hasUpgrade("inf", 24)}, // This one is a freebie
            goalTooltip: "Buy all auto prestige for row 2.", // Shows when achievement is not completed
            doneTooltip: "Buy all auto prestige for row 2.", // Showed when the achievement is completed
            onComplete() {
                player[this.layer].points = player[this.layer].points.mul(1.03);
            },
        },
        34 : {
            name: "Not so challenging",
            done() {return hasChallenge("inf", 11)}, // This one is a freebie
            goalTooltip: "Finish EASY challenge once.", // Shows when achievement is not completed
            doneTooltip: "Finish EASY challenge once.", // Showed when the achievement is completed
            onComplete() {
                player[this.layer].points = player[this.layer].points.mul(1.03);
            },
        },
        41 : {
            name: "5 dozens of infinities",
            done() {return player["inf"].points.gte(60)},
            goalTooltip: "Get 60 ip.",
            doneTooltip: "Get 60 ip.",
            onComplete() {
                player[this.layer].points = player[this.layer].points.mul(1.03);
            },
        },
        42 : {
            name: "3k infinities",
            done() {return player["inf"].points.gte(3000)},
            goalTooltip: "Get 3000 ip.<br>Reward: points in row 2 becomes much cheaper.",
            doneTooltip: "Get 3000 ip.<br>Reward: points in row 2 becomes much cheaper.",
            onComplete() {
                player[this.layer].points = player[this.layer].points.mul(1.03);
            },
        },
        43 : {
            name: "Faster than a potato",
            done() {return getPointGen().div(player.points.add(1)).gt(1e29)},
            goalTooltip: "Get 29 OoMs of np per second.",
            doneTooltip: "Get 29 OoMs of np per second.",
            onComplete() {
                player[this.layer].points = player[this.layer].points.mul(1.03);
            },
        },
        44 : {
            name: "Nearly 1e-21 Universe",
            done() {return player["s"].points.gte(15)},
            goalTooltip: "Get 15 stars.",
            doneTooltip: "Get 15 stars.",
            onComplete() {
                player[this.layer].points = player[this.layer].points.mul(1.1);
            },
        },
        51 : {
            name: "Energetic Energy",
            done() {return buyableEffect("s", 11).mul(buyableEffect("s", 12)).mul(buyableEffect("s", 13)).gte(2303)},
            goalTooltip: "Get at least x2304 energy power from upgrades in S.<br>Reward: These upgrades increases energy gain, and also unlockes something great.",
            doneTooltip: "Get at least x2304 energy power from upgrades in S.",
            onComplete() {
                player[this.layer].points = player[this.layer].points.mul(2.5);
            },
        }
    },
})
