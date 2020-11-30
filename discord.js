const Discord = require('discord.js');
require('colors');
const client = new Discord.Client();
const token = process.argv[2];
const prefix = process.argv[3];
var sexNotStopped = true;
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
    sex: async msg => {
        msg.channel.send("sex").catch(err => {
            console.log("Error: ".red + err);
        });
    },
    /**
     * 
     * @param {Discord.Message} msg Message object
     */
    alotofsex: async msg => {
        sexNotStopped = true;
        msg.channel.send("A lot of sex.").catch(err => {
            console.log("Error: ".red + err);
        });
        setInterval(() => {if(sexNotStopped) msg.channel.send("sex").catch(err => {
            console.log("Error: ".red + err);
        });}, 2000)
    },
    /**
     * 
     * @param {Discord.Message} msg Message object
     */
    stopsex: async msg => {
        sexNotStopped = false;
        msg.channel.send("Sex stopped.").catch(err => {
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
        }
        return;
    }
});
client.login(token).catch(err => {
    console.log("Error: ".red + "TOKEN INVALID".bold);
    process.exit(0);
});