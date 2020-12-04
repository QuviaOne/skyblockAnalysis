const Discord = require('discord.js');
require('colors');
const { BazaarState } = require('./modules/classDef');

const client = new Discord.Client();
const token = process.argv[2];
const prefix = process.argv[3];
var bazaarUpdateSendInterval;
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
            await msg.channel.send("Use **[prefix]bazaarFlip [update_loop_interval_in_seconds]**").catch(err => {
                console.log("Error: ".red + err);
            });
            return;
        }
        if (msg.content.split(" ")[1] == undefined) {
            var bazaarState = new BazaarState();
            await bazaarState.load();
            var flips = bazaarState.getTopProfits(10);
            var embed = require('./flipsEmbed.json');
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
        bazaarUpdateSendInterval = setInterval(async() => {
            var bazaarState = new BazaarState();
            await bazaarState.load();
            var flips = bazaarState.getTopProfits(10);
            var embed = require('./flipsEmbed.json');
            for (var flip of flips) {
                embed.embed.fields.push({
                    name: flip.id,
                    value: `Absolute profit per unit: ${Math.round(flip.price.profit.getAbsolute() * 1000) / 1000}. Relative profit: ${Math.round((flip.price.profit * 100 - 100) * 1000) / 1000} %\nMove worth per week: ${Math.round(flip.quickStatus.buyMovingWeek * flip.price.getBuyPrice())} coins`
                })
            }
            msg.channel.send(embed);
        }, period * 1000);
        await msg.channel.send("Update loop set. Interval period: " + period + " s").catch(err => {
            console.log("Error: ".red + err);
        });
    },
    /**
     * 
     * @param {Discord.Message} msg Message object
     */
    unknown: async msg => {
        msg.channel.send("I'm sorry, but I don't know that command.").catch(err => {
            console.log("Error: ".red + err);
        });
    },

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