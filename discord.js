const Discord = require('discord.js');
require('colors');
const fs = require('fs');
const { BazaarState } = require('./modules/classDef');

const client = new Discord.Client();
const token = process.argv[2];
const prefix = process.argv[3];
var bazaarUpdateSendInterval;
var bazaarFlipBlacklist = require("./blacklist.json") || [];
console.log("Loaded with token: " + token.bold, "and prefix: " + prefix.bold);
const commands = {
    /**
     * 
     * @param {Discord.Message} msg Message object
     */
    ping: async msg => {
        msg.channel.send("Pong!").catch(err => {
            console.log("Error: ".red + err);
        });
    },
    /**
     * 
     * @param {Discord.Message} msg Message object
     */
    bazaarFlip: async msg => {
        if (msg.content.split(" ")[1] == "help") {
            await msg.channel.send("Use **[prefix]bazaarFlip [update_loop_interval_in_seconds]**").then(m => {
                setTimeout(() => {
                    m.delete().catch(e=> {
                        console.log("Error deleting message: ".red + e);
                    });
                    msg.delete().catch(e=> {
                        console.log("Error deleting message: ".red + e);
                    });
                }, 2000);

            }).catch(err => {
                console.log("Error: ".red + err);
            });
            return;
        }
        if (msg.content.split(" ")[1] == "blacklist") {
            if (msg.content.split(" ")[2] == "add") {
                let id = msg.content.split(" ")[3];
                if (bazaarFlipBlacklist.includes(id)) {
                    msg.channel.send("This item is already on the blacklist.").then(m => {
                        setTimeout(() => {
                            m.delete().catch(e=> {
                                console.log("Error deleting message: ".red + e);
                            });
                            msg.delete().catch(e=> {
                                console.log("Error deleting message: ".red + e);
                            });
                        }, 2000);

                    });
                } else {
                    bazaarFlipBlacklist.push(id);
                    msg.channel.send("Id has been added to the blacklist.").then(m => {
                        setTimeout(() => {
                            m.delete().catch(e=> {
                                console.log("Error deleting message: ".red + e);
                            });
                            msg.delete().catch(e=> {
                                console.log("Error deleting message: ".red + e);
                            });
                        }, 2000);

                    });
                }
                return;
            }
            if (msg.content.split(" ")[2] == "remove") {
                let id = msg.content.split(" ")[3];
                for (var i = 0; bazaarFlipBlacklist.length; i++) {
                    if(bazaarFlipBlacklist[i] == id) {
                        bazaarFlipBlacklist.splice(i, 1);
                        break;
                    }
                }
                msg.channel.send("The item is no longer on the blacklist.").then(m => {
                    setTimeout(() => {
                        m.delete().catch(e=> {
                            console.log("Error deleting message: ".red + e);
                        });
                        msg.delete().catch(e=> {
                            console.log("Error deleting message: ".red + e);
                        });
                    }, 2000);

                });
                return;
            }
            if (msg.content.split(" ")[2] == "help") {
                msg.channel.send("Use *blacklist* to print the blacklist, *blacklist add*[ITEM_ID] to add an item to the blacklist or *blacklist remove*[ITEM_ID] to remove an item from the blacklist.").then(m => {
                    setTimeout(() => {
                        m.delete().catch(e=> {
                            console.log("Error deleting message: ".red + e);
                        });
                        msg.delete().catch(e=> {
                            console.log("Error deleting message: ".red + e);
                        });
                    }, 2000);
                });
                return;
            }
            if (msg.content.split(" ")[2] == "save") {
                fs.writeFileSync("./blacklist.json", JSON.stringify(bazaarFlipBlacklist));
                msg.channel.send("Blacklist saved.").then(m => {
                    setTimeout(() => {
                        m.delete().catch(e=> {
                            console.log("Error deleting message: ".red + e);
                        });
                        msg.delete().catch(e=> {
                            console.log("Error deleting message: ".red + e);
                        });
                    }, 2000);
                });
                return;
            }
            var text = "Blacklist: \n"
            text += bazaarFlipBlacklist.join("\n");
            msg.channel.send(text).then(m => {
                setTimeout(() => {
                    m.delete().catch(e=> {
                        console.log("Error deleting message: ".red + e);
                    });
                    msg.delete().catch(e=> {
                        console.log("Error deleting message: ".red + e);
                    });
                }, 2000);

            });
            return;
        }
        
        if (msg.content.split(" ")[1] == undefined) {
            var bazaarState = new BazaarState();
            await bazaarState.load();
            var flips = bazaarState.getTopProfits(10, blacklist);
            var embed = require('./flipsEmbed.json');
            embed.embed.fields = [];
            for (var flip of flips) {
                embed.embed.fields.push({
                    name: flip.id,
                    value: `Absolute profit per unit: ${Math.round(flip.price.profit.getAbsolute() * 1000) / 1000}. Relative profit: ${Math.round((flip.price.profit * 100 - 100) * 10000) / 10000} %\nMove worth per week: ${Math.round(flip.quickStatus.buyMovingWeek * flip.price.getBuyPrice())} coins\nSell price: ${Math.round(flip.price.getSellPrice() * 1000) / 1000}\nBuy price: ${Math.round(flip.price.getBuyPrice() * 1000) / 1000}`,
                })
            }
            await msg.channel.send(embed);
            return;
        }
        /**
         * @type {Number} interval period in seconds
         */
        var period = Number(msg.content.split(" ")[1]);
        /**
         * @type {Number} Interval ID
         */
        var pvr = await msg.channel.send("Update loop set. Interval period: " + period + " s").catch(err => {
            console.log("Error: ".red + err);
        });
        bazaarUpdateSendInterval = setInterval(async() => {
            if (pvr.deleted) {
                clearInterval(bazaarUpdateSendInterval)
                msg.channel.send("Update disabled.");
                return;
            }
            var bazaarState = new BazaarState();
            await bazaarState.load();
            var flips = bazaarState.getTopProfits(10, bazaarFlipBlacklist);
            var embed = require('./flipsEmbed.json');
            embed.embed.fields = [];
            embed.embed.description = embed.embed.description.split("\n")[0];
            embed.embed.description += "\n" + new Date(bazaarState.timestamp).toUTCString();
            for (var flip of flips) {
                embed.embed.fields.push({
                    name: flip.id,
                    value: `Absolute profit per unit: ${Math.round(flip.price.profit.getAbsolute() * 1000) / 1000}. Relative profit: ${Math.round((flip.price.profit * 100 - 100) * 1000) / 1000} %\nBuying worth per week: ${Math.round(flip.quickStatus.buyMovingWeek * flip.price.getSellPrice()/1e4)/100} mil.\nSelling worth per week: ${Math.round(flip.quickStatus.sellMovingWeek * flip.price.getBuyPrice()/1e4)/100} mil. \nSell price: ${Math.round(flip.price.getSellPrice() * 1000) / 1000}\nBuy price: ${Math.round(flip.price.getBuyPrice() * 1000) / 1000}`
                })
            }
            pvr.edit(embed);
        }, period * 1000);
        
    },
    /**
     * 
     * @param {Discord.Message} msg Message object
     */
    unknown: async msg => {
        msg.channel.send("I'm sorry, but I don't know that command.").catch(err => {
            console.log("Error: ".red + err);
        });
    }

}

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', async msg => {
    if (msg.author.bot) return;
    if (msg.content.startsWith(prefix)) {
        try {
            await commands[msg.content.replace(prefix, "").split(" ")[0]](msg);
        } catch (e) {
            await commands["unknown"](msg);
            console.log(e);
        }
        return;
    }
});
client.login(token).catch(err => {
    console.log("Error: ".red + "TOKEN INVALID".bold);
    process.exit(0);
});