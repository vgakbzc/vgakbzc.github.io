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
            name: "Did you really break the softcap?",
            done() {return hasUpgrade("c", 34)}, // This one is a freebie
            goalTooltip: "Buy upgrade 34 in C.", // Shows when achievement is not completed
            doneTooltip: "Buy upgrade 34 in C.", // Showed when the achievement is completed
            onComplete() {
                player[this.layer].points = player[this.layer].points.mul(1.03);
            }
        },
        13 : {
            name: "R U going 2 sleep?",
            done() {return buyableEffect("id", 11).gt(0)}, // This one is a freebie
            goalTooltip: "Buy an upgrade in Id.", // Shows when achievement is not completed
            doneTooltip: "Buy an upgrade in Id.", // Showed when the achievement is completed
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
            name: "I can FINALLY breath!",
            done() {return player["a"].points.gte(1)}, // This one is a freebie
            goalTooltip: "Get an air point.", // Shows when achievement is not completed
            doneTooltip: "Get an air point.", // Showed when the achievement is completed
            onComplete() {
                player[this.layer].points = player[this.layer].points.mul(1.03);
            }
        },
        22 : {
            name: "Water is the most important thing.",
            done() {return player["w"].points.gte(1)}, // This one is a freebie
            goalTooltip: "Get a water point.", // Shows when achievement is not completed
            doneTooltip: "Get a air point.", // Showed when the achievement is completed
            onComplete() {
                player[this.layer].points = player[this.layer].points.mul(1.03);
            }
        },
        23 : {
            name: "Earth, not a planet.",
            done() {return player["e"].points.gte(1)}, // This one is a freebie
            goalTooltip: "Get an earth point.", // Shows when achievement is not completed
            doneTooltip: "Get an earth point.", // Showed when the achievement is completed
            onComplete() {
                player[this.layer].points = player[this.layer].points.mul(1.03);
            }
        },
        24 : {
            name: "When you crash and burn",
            done() {return player["f"].points.gte(1)}, // This one is a freebie
            goalTooltip: "Get a fire point.", // Shows when achievement is not completed
            doneTooltip: "Get a fire point.", // Showed when the achievement is completed
            onComplete() {
                player[this.layer].points = player[this.layer].points.mul(1.03);
            }
        },
    },
})
