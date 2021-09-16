addLayer("au", {
    //name: "Fire", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "Au", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 3, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    //branches : ["c"],
    startData() { return {
        unlocked: true,
        autoCp: false,
        npProductDecrease: false,
    }},
    color: "#42f971",
    type: "none",
    row: "side", // Row the layer is in on the tree (0 is the first row)
    layerShown(){
        return true
    },
    tooltip() {
        return "Automation"
    },
    clickables: {
        11: {
            display() {
                let tmpString = "Produce null points at a much slower speed but always get Inertia.<br>Currently: "
                if(player[this.layer].npProductDecrease) tmpString = tmpString + "On"
                else tmpString = tmpString + "Off"
                return tmpString
            },
            onClick() {
                player[this.layer].npProductDecrease = !player[this.layer].npProductDecrease
            },
            canClick() {
                return true
            },
            style() {
                if(player[this.layer].npProductDecrease) return {"background-color": "#33cccd", "color": "black"}
                else return {"background-color": "#af5f5f", "color": "black"}
            },
        },
        12: {
            display() {
                let tmpString = "Auto buy upgrades in C.<br>Currently: "
                if(player[this.layer].autoCp) tmpString = tmpString + "On"
                else tmpString = tmpString + "Off"
                return tmpString
            },
            onClick() {
                player[this.layer].autoCp = !player[this.layer].autoCp
            },
            canClick() {
                return true
            },
            style() {
                if(player[this.layer].autoCp) return {"background-color": "#aaaaaa", "color": "black"}
                else return {"background-color": "#af5f5f", "color": "black"}
            },
            unlocked() {
                return hasMilestone("f", 0)
            }
        },
    }
})
