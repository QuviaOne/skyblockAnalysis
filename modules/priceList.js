const nim = require('./networkInteractionModule.js')

/**
 * @enum {String}
 */
const ORIGINS = [
    "ah",
    "bz"
]
const REFORGES = ["gentle", "odd", "fast", "fair", "epic", "sharp", "heroic", "spicy", "legendary", "dirty", "fabled", "suspicious", "gilded", "warped", "salty", "treacherous", "deadly", "fine", "grand", "hasty", "neat", "rapid", "unreal", "awkward", "rich", "precise", "spiritual", "clean", "fierce", "heavy", "light", "mythic", "pure", "smart", "titanic", "wise", "perfect", "necrotic", "spiked", "renowned", "cubic", "reinforced", "loving", "ridiculous", "giant", "submerged", "absolutely", "bizarre", "itchy", "ominous", "pleasant", "pretty", "shiny", "simple", "strange", "vivid", "godly", "demonic", "forceful", "strong", "superior", "unpleasant", "zealous", "silky", "bloody", "shaded", "sweet", "fruitful", "magnetic", "refined", "blessed", "moil", "toil"];
const ENCHANTS = [, "big brain", "bane of arthropods", "feather falling", "spiked hook", "depth strider", "ender slayer", "giant killer", "luck of the sea", "sugar rush", "aqua affinity", "fire aspect", "first strike", "infinite quiver", "life steal", "true protection", "silk touch"];
/**
 * @class
 * @description The object, that keeps track of prices.
 * @typedef PriceList
 */
module.exports = class PriceList {
    /**
     * @description Creates a price list obejct.
     */
    constructor() {
        this.timestamp = new Date().getTime();
        this.bazaarItems = [new module.exports.Item("bz", "Coin", 1, 1)];
        this.auctionItems = [];
    }
    /**
     * @description Loads current prices from the Bazaar.
     * @returns {Promise<void>}
     */
    async loadBazaarPrices() {
        var bazaarObject = await nim.Hypixel.getBazaar();
        for (var i in bazaarObject.products) {
            try {
                this.bazaarItems.push(new module.exports.Item("bz", bazaarObject.products[i].product_id, bazaarObject.products[i].sell_summary[0].pricePerUnit, bazaarObject.products[i].buy_summary[0].pricePerUnit, bazaarObject.products[i].quick_status));
            } catch (e) {
            }
        }
    }
    /**
     * @description Loads current prices from the Auction House.
     * @returns {Promise<void>}
     */
    async loadAuctionPrices() {
        var auctions = await nim.Hypixel.getAuctions();
        for (var a of auctions) {
            if (this.auctionItems.filter(b => b.name == auctionObjectToItemDictionaryName(a)).length == 0 && module.exports.Item.craftableItems.includes(auctionObjectToItemDictionaryName(a))) this.auctionItems.push(new module.exports.Item("ah", auctionObjectToItemDictionaryName(a), a.highest_bid_amount + 1, a.highest_bid_amount, a)); else if (this.auctionItems.filter(b => b.name == auctionObjectToItemDictionaryName(a)).length == 1 && a.highest_bid_amount < this.auctionItems.filter(b => b.name == auctionObjectToItemDictionaryName(a))[0].buyPrice) this.auctionItems.filter(b => b.name == auctionObjectToItemDictionaryName(a))[0].setPrice(a.highest_bid_price);
        }
    }
    /**
     * 
     * @param {String} name Name of the item
     * @returns {Item} 
     */
    getItem(name) {
        for (var a of this.bazaarItems) {
            if (a.name == name) return a;
        }
        for (var a of this.auctionItems) {
            if (a.name == name) return a;
        }
        return undefined;
    }
    findFlips() {
        this.flips = [];
        for (var a of this.bazaarItems) {
            if (a.sellPrice > a.cost()) this.flips.push(new Flip(a.name, a.sellPrice, a.cost()));
        }
        for (var a of this.auctionItems) {
            if (a.sellPrice > a.cost()) this.flips.push(new Flip(a.name, a.sellPrice, a.cost()));
        }
    }
}
/**
 * @class
 * @description Item
 * @typedef {Object}
 */
module.exports.Item = class Item {
    /**
     * 
     * @param {ORIGINS} origin Origin of the Item
     * @param {String} name Name of the Item
     * @param {Number} buyPrice Price to buy the item
     * @param {Number} sellPrice Price to buy the sell
     * @param {Object<String, String|Number>} quickStat 
     */
    constructor(origin, name, buyPrice, sellPrice, quickStat) {
        this.origin = origin;
        this.name = name;
        this.buyPrice = buyPrice;
        this.sellPrice = sellPrice;
        this.quickStat = quickStat;
    }
    /**
     * @description Returns the cost of this item, if you would purchase it
     * @returns {Number}
     */

    /**
     * @description Returns the cost of ingredients to craft the item or purchase the item (whatever is cheaper).
     * @returns {Number}
     */
    cost() {
        if (!module.exports.Item.craftableItems.map(item => item.name).includes(this.name)) return this.buyPrice;
        var cost;
        var items = module.exports.Item.craftableItems.find(e => e.name == this.name).craft.map(e => { item: getItem(e.id), amount: e.amount });
        if (item.map(e => e.item).includes(undefined)) return (console.log("Items in recepie not craftable or purchasable."), this.buyPrice);
        cost = items.reduce((acc, item) => acc + item.item.cost() * item.amount);
        if (cost > this.buyPrice) return this.buyPrice; else; return cost;
    }
    setPrice(price) {
        this.buyPrice = price + 1;
        this.sellPrice = price;
    }
}
module.exports.Flip = class Flip {

}
module.exports.Item.craftableItems = require("../items.json");
/**
 * 
 * @param {Object} auctionObject Auction object to convert.
 */
function auctionObjectToItemDictionaryName(auctionObject) {
    if (REFORGES.includes(auctionObject.item_name.split(" ")[0].toLowerCase())) {
        auctionObject.item_name = auctionObject.item_name.split(" ").splice(1, auctionObject.item_name.split(" ").length - 1).join(" ");
    }
    if (a.item_name == "Enchanted Book") {
        auctionObject.item_name = "Enchanted book: " + auctionObject.extra.split(" ").splice(4, auctionObject.extra.split(" ").length - 4).join(" ");
    }
    return auctionObject.item_name;
}