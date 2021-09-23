addLayer("au", {
    //name: "Fire", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "Au", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 3, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    //branches : ["c"],
    startData() { return {
        unlocked: true,
        autoCp: false,
        npProductDecrease: false,
        autoRow2: [false, false, false, false],
        autoRow2Upgrade: [false, false, false, false],
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
        21: {
            display() {
                let tmpString = "Auto reset for ap.<br>Currently: "
                if(player[this.layer].autoRow2[0]) tmpString = tmpString + "On"
                else tmpString = tmpString + "Off"
                return tmpString
            },
            onClick() {
                player[this.layer].autoRow2[0] = !player[this.layer].autoRow2[0]
            },
            canClick() {
                return true
            },
            style() {
                if(player[this.layer].autoRow2[0]) return {"background-color": layers["a"].color, "color": "black"}
                else return {"background-color": "#af5f5f", "color": "black"}
            },
            unlocked() {
                return hasUpgrade("inf", 21)
            }
        },
        22: {
            display() {
                let tmpString = "Auto reset for fp.<br>Currently: "
                if(player[this.layer].autoRow2[1]) tmpString = tmpString + "On"
                else tmpString = tmpString + "Off"
                return tmpString
            },
            onClick() {
                player[this.layer].autoRow2[1] = !player[this.layer].autoRow2[1]
            },
            canClick() {
                return true
            },
            style() {
                if(player[this.layer].autoRow2[1]) return {"background-color": layers["f"].color, "color": "black"}
                else return {"background-color": "#af5f5f", "color": "black"}
            },
            unlocked() {
                return hasUpgrade("inf", 22)
            }
        },
        23: {
            display() {
                let tmpString = "Auto reset for ep.<br>Currently: "
                if(player[this.layer].autoRow2[2]) tmpString = tmpString + "On"
                else tmpString = tmpString + "Off"
                return tmpString
            },
            onClick() {
                player[this.layer].autoRow2[2] = !player[this.layer].autoRow2[2]
            },
            canClick() {
                return true
            },
            style() {
                if(player[this.layer].autoRow2[2]) return {"background-color": layers["e"].color, "color": "black"}
                else return {"background-color": "#af5f5f", "color": "black"}
            },
            unlocked() {
                return hasUpgrade("inf", 23)
            }
        },
        24: {
            display() {
                let tmpString = "Auto reset for wp.<br>Currently: "
                if(player[this.layer].autoRow2[3]) tmpString = tmpString + "On"
                else tmpString = tmpString + "Off"
                return tmpString
            },
            onClick() {
                player[this.layer].autoRow2[3] = !player[this.layer].autoRow2[3]
            },
            canClick() {
                return true
            },
            style() {
                if(player[this.layer].autoRow2[3]) return {"background-color": layers["w"].color}
                else return {"background-color": "#af5f5f", "color": "black"}
            },
            unlocked() {
                return hasUpgrade("inf", 24)
            }
        },
        31: {
            display() {
                let tmpString = "Auto buy ap upgrades.<br>Currently: "
                if(player[this.layer].autoRow2Upgrade[0]) tmpString = tmpString + "On"
                else tmpString = tmpString + "Off"
                return tmpString
            },
            onClick() {
                player[this.layer].autoRow2Upgrade[0] = !player[this.layer].autoRow2Upgrade[0]
            },
            canClick() {
                return true
            },
            style() {
                if(player[this.layer].autoRow2Upgrade[0]) return {"background-color": layers["a"].color, "color": "black"}
                else return {"background-color": "#af5f5f", "color": "black"}
            },
            unlocked() {
                return hasUpgrade("inf", 31)
            }
        },
        32: {
            display() {
                let tmpString = "Auto buy fp upgrades.<br>Currently: "
                if(player[this.layer].autoRow2Upgrade[1]) tmpString = tmpString + "On"
                else tmpString = tmpString + "Off"
                return tmpString
            },
            onClick() {
                player[this.layer].autoRow2Upgrade[1] = !player[this.layer].autoRow2Upgrade[1]
            },
            canClick() {
                return true
            },
            style() {
                if(player[this.layer].autoRow2Upgrade[1]) return {"background-color": layers["f"].color, "color": "black"}
                else return {"background-color": "#af5f5f", "color": "black"}
            },
            unlocked() {
                return hasUpgrade("inf", 32)
            }
        },
        33: {
            display() {
                let tmpString = "Auto buy ep upgrades.<br>Currently: "
                if(player[this.layer].autoRow2Upgrade[2]) tmpString = tmpString + "On"
                else tmpString = tmpString + "Off"
                return tmpString
            },
            onClick() {
                player[this.layer].autoRow2Upgrade[2] = !player[this.layer].autoRow2Upgrade[2]
            },
            canClick() {
                return true
            },
            style() {
                if(player[this.layer].autoRow2Upgrade[2]) return {"background-color": layers["e"].color, "color": "black"}
                else return {"background-color": "#af5f5f", "color": "black"}
            },
            unlocked() {
                return hasUpgrade("inf", 33)
            }
        },
        34: {
            display() {
                let tmpString = "Auto buy wp upgrades.<br>Currently: "
                if(player[this.layer].autoRow2Upgrade[3]) tmpString = tmpString + "On"
                else tmpString = tmpString + "Off"
                return tmpString
            },
            onClick() {
                player[this.layer].autoRow2Upgrade[3] = !player[this.layer].autoRow2Upgrade[3]
            },
            canClick() {
                return true
            },
            style() {
                if(player[this.layer].autoRow2Upgrade[3]) return {"background-color": layers["w"].color, "color": "black"}
                else return {"background-color": "#af5f5f", "color": "black"}
            },
            unlocked() {
                return hasUpgrade("inf", 34)
            }
        },
    }
})
