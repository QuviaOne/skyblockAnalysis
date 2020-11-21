const MAX_PAGES = 1000;
/**
 * @description Interacts with external APIs
 * @object 
 */
const request = require('request');
module.exports = {
    /**
     * @description Mojang API intraction 
     */
    mojang: {

    },
    Hypixel: {
        /**
         * @description Returns bazaar data
         * @returns {Object}
         */
        getBazaar: () => {
            return new Promise((resolve, reject) => {
                request.get("https://api.hypixel.net/skyblock/bazaar", (err, data) => {
                    if (err) return resolve({
                        products: []
                    });
                    try {
                        resolve(JSON.parse(data.body));
                    } catch (e) {
                        resolve({
                            products: []
                        });
                    }
                });
            });
        },
        getAuctions: async () => {
            const t0 = process.hrtime();
            var t1 = process.hrtime();
            var page0 = await getAHpage(0);
            console.log("Started loading " + page0.totalPages + " pages.");
            var auctions = page0.auctions;
            for (var i = 1; i < page0.totalPages && i < MAX_PAGES; i++) {
                t1 = process.hrtime();
                auctions = auctions.concat((await getAHpage(i)).auctions);
                console.log("Loaded page: " + i + ". Took: " + hrtimeDiffInMs(t1) + " ms.");
            }
            for (var j = 0; j < auctions.length; j++) {
                if (auctions[j].name == "Spiked Perfect Leggings - Tier XII") console.log(auctions[j]);
                if (!auctions[j].bin || auctions[j].claimed) {
                    auctions[j] = undefined;
                    continue;
                }
                auctions[j].item_bytes = undefined;
                auctions[j].uuid = undefined;
                auctions[j].auctioneer = undefined;
                auctions[j].coop = undefined;
                // auctions[j].item_lore = undefined;
                // auctions[j].extra = undefined;
                auctions[j].category = undefined;
                auctions[j].claimed_bidders = undefined;
            }
            for (var j = 0; j < auctions.length; j++) {
                if (auctions[j] == undefined) auctions.splice(j, 1);
            }
            console.log("Done loading. Loaded: " + auctions.length + " items. Took: " + hrtimeDiffInMs(t0) + " ms.");
            return auctions;
        }
    },
    apiKey: "fd0edde5-5be1-47fd-9bf5-701de0d480cf",
    /**
     * @class
     * @description Represents minecraft user.
     */
    User: class User {
        /**
         * 
         * @param {String} ign In-Game Nick of the User
         */
        constructor(ign) {
            this.ign = ign;
        }
        /**
         * @description Gets the UUID of the user
         * @return {Promise<String>}
         */
        getUUID() {
            return new Promise((resolve, reject) => {
                request.get(`https://api.mojang.com/users/profiles/minecraft/${this.ign}?at=${new Date().getTime()}`, (err, data) => {
                    if (err) return reject(err);
                    resolve(JSON.parse(data.body).id);
                });
            });
        }
        /**
         * @description Gets the Hypixel data of the user
         * @return {Promise<String>}
         */
        getHypixelData() {
            return new Promise((resolve, reject) => {
                request.get(`https://api.hypixel.net/player?key=${module.exports.apiKey}&name=${this.ign}`, (err, data) => {
                    if (err) return reject(err);
                    resolve(JSON.parse(data.body));
                });
            })
        }
    }
}
/**
 * 
 * @param {Number} page Gets auctions on page page
 */
function getAHpage(page) {
    return new Promise((resolve, reject) => {
        request.get("https://api.hypixel.net/skyblock/auctions?page=" + page, (err, data) => {
            if (err) return reject(err);
            resolve(JSON.parse(data.body));
        });
    });
}
/**
 * 
 * @param {Array<Number>} hrtime The t0 hrtime array.
 * @description Gets hrtime difference in μs
 * @returns {Number}
 */
function hrtimeDiffInμs(hrtime) {
    return Math.round((process.hrtime()[0] - hrtime[0]) * 1e6 + (process.hrtime()[1] - hrtime[1]) * 1e-3);
}
/**
 * 
 * @param {Array<Number>} hrtime The t0 hrtime array.
 * @description Gets hrtime difference in ms
 * @returns {Number}
 */
function hrtimeDiffInMs(hrtime) {
    return Math.round((process.hrtime()[0] - hrtime[0]) * 1e3 + (process.hrtime()[1] - hrtime[1]) * 1e-6);
}
/**
 * 
 * @param {Array<Number>} hrtime The t0 hrtime array.
 * @description Gets hrtime difference in ns
 * @returns {Number}
 */
function hrtimeDiffInNs(hrtime) {
    return Math.round((process.hrtime()[0] - hrtime[0]) * 1e9 + (process.hrtime()[1] - hrtime[1]));
}