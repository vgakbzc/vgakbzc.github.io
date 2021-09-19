var inertiaPerSecond = new Decimal(0)
var inertiaCap = new Decimal(60)
var inertiaGenerationLimit = new Decimal(2)

addLayer("id", {
    name: "idle", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "Id", // This appears on the layer's node. Default is the id with the first letter capitalized
    startData() { return {
        unlocked: true,
		points: new Decimal(0),
    }},
    color: "#33ccaa",
    resource: "seconds of Inertia", // Name of prestige currency
    row: "side", // Row the layer is in on the tree (0 is the first row)
    layerShown(){return true},
    midsection: [
        ["display-text", function(){
            return "You are getting " + format(inertiaPerSecond) + " seconds of Inertia every second."
        }], 
        ["display-text", function(){
            return "Your Inertia is capped at " + format(inertiaCap) + " seconds."
        }],
        ["display-text", function(){
            return "Inertia is only generated when your np/s isn't greater than " + format(inertiaGenerationLimit) + "."
        }],
        "blank", "blank", "blank", "blank"
    ],
    shouldNotify() { 
        return getPointGen().lte(inertiaGenerationLimit) && player[this.layer].points.lt(inertiaCap)
    },
    glowColor: "#33ccaa",
    buyables: {
        11: {
            title: "More Null Points", // Optional, displayed at the top in a larger font
            cost(x) { // cost for buying xth buyable, can be an object if there are multiple currencies
                let cost = (new Decimal(10)).pow(x.pow(0.3))
                if(x > 10) {
                    cost = cost.pow(1.9)
                }
                if(x > 20) {
                    cost = cost.pow(1.4)
                }
                if(x > 30) {
                    cost = cost.pow(1.14)
                }
                if(x > 40) {
                    cost = cost.pow(1.17)
                }
                return cost.floor()
            },
            effect(x) { // Effects of owning x of the items, x is a decimal
                let eff = new Decimal(1.21);
                return eff.pow(x).pow(player[this.layer].points.pow(0.2)).pow(0.9);
            },
            display() { // Everything else displayed in the buyable button after the title
                let data = tmp[this.layer].buyables[this.id]
                return "Cost: " + format(data.cost) + " seconds of Inertia\n\
                Amount: " + player[this.layer].buyables[this.id] + " / 50\n\
                Multiplies your np gain by " + format(data.effect)
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
            purchaseLimit: new Decimal(50),
        },
        12: {
            title: "Higher Inertia Cap", // Optional, displayed at the top in a larger font
            cost(x) { // cost for buying xth buyable, can be an object if there are multiple currencies
                let cost = (new Decimal(2)).pow(x).mul(30)
                return cost.floor()
            },
            effect(x) { // Effects of owning x of the items, x is a decimal
                let eff = (new Decimal(2)).pow(x)
                return eff;
            },
            display() { // Everything else displayed in the buyable button after the title
                let data = tmp[this.layer].buyables[this.id]
                return "Cost: " + format(data.cost) + " seconds of Inertia\n\
                Amount: " + player[this.layer].buyables[this.id] + " / 50\n"
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
            purchaseLimit: new Decimal(50),
        },
        21: {
            title: "Faster Inertia Generation", // Optional, displayed at the top in a larger font
            cost(x) { // cost for buying xth buyable, can be an object if there are multiple currencies
                let cost = (new Decimal(2.71828184)).pow(x.pow(1.3334))
                return cost.floor()
            },
            effect(x) { // Effects of owning x of the items, x is a decimal
                let eff = (new Decimal(2)).pow(x.pow(1.2))
                return eff;
            },
            display() { // Everything else displayed in the buyable button after the title
                let data = tmp[this.layer].buyables[this.id]
                return "Cost: " + format(data.cost) + " seconds of Inertia\n\
                Amount: " + player[this.layer].buyables[this.id] + " / 50\n"
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
            purchaseLimit: new Decimal(50),
        },
        22: {
            title: "Higher Generation np/s Cap", // Optional, displayed at the top in a larger font
            cost(x) { // cost for buying xth buyable, can be an object if there are multiple currencies
                let cost = (new Decimal(11.4514191981)).pow(x.pow(1.3334))
                return cost.floor()
            },
            effect(x) { // Effects of owning x of the items, x is a decimal
                let eff = (new Decimal(player["c"].resetTime)).add(1).pow(x.add(1).pow(x.pow(0.1))).mul((new Decimal(player["c"].resetTime)).add(1).pow(0.33).exp().pow(0.2).pow(x)).mul(x).add(1)
                return eff;
            },
            display() { // Everything else displayed in the buyable button after the title
                let data = tmp[this.layer].buyables[this.id]
                return "Effect of this upgrade resets when C resets.\nCost: " + format(data.cost) + " seconds of Inertia\n\
                Amount: " + player[this.layer].buyables[this.id] + " / 50\n\
                Effect: " + format(buyableEffect(this.layer, this.id))
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
            purchaseLimit: new Decimal(50),
        },
    },
    update(diff) {
        inertiaGenerationLimit = (new Decimal(2)).mul(buyableEffect(this.layer, "22")).mul(buyableEffect(this.layer, "11"))
        //if(hasUpgrade("c", 43)) inertiaGenerationLimit = inertiaGenerationLimit.mul(upgradeEffect("c", 43))
        if((getPointGen().lte(inertiaGenerationLimit) || player["au"].npProductDecrease) && player[this.layer].points.lt(inertiaCap)) {
            inertiaPerSecond = new Decimal(0.05)
            inertiaPerSecond = inertiaPerSecond.mul(buyableEffect(this.layer, "21"))
        } else {
            inertiaPerSecond = new Decimal(0)
        }
        player[this.layer].points = player[this.layer].points.add(inertiaPerSecond.mul(diff))
        inertiaCap = (new Decimal(60)).mul(buyableEffect(this.layer, "12"))
        if(player[this.layer].points.gt(inertiaCap)) player[this.layer].points = inertiaCap
    },
})