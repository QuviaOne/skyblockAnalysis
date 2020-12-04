const fs = require('fs');
const nim = require('./networkInteractionModule.js');
/**
 * @typedef BazaarObject
 */
/**
 * @class
 * @description Represents an Item from the bazaar
 */
module.exports.Item = class Item {
    /**
     * 
     * @param {String} id Id of the item
     */
    constructor(id) {
        this.id = id;
        this.prices = new module.exports.PriceManager(this);
    }
    /**
     * 
     * @param {BazaarObject} bazaarObject The bazaar object of the item
     * @description Adds a price to this item.
     */
    addNewPrice(bazaarObject) {
        this.prices.addPrice(bazaarObject);
    }

}
/**
 * @class
 * @description Class, that manages items
 */
module.exports.ItemManager = class ItemManager extends Array {
    constructor() {
        super();
    }
    /**
     * @description Adds an item with id to the managed items list
     * @param {String} id Id of the Item
     * @returns {void}
     */
    addItemById(id) {
        this.push(new module.exports.Item(id));
    }
    /**
     * @description Loads all items from bazaar
     * @returns {Promise<void>}
     */
    async loadItems() {
        while (true) {
            try {
                for (var itemID in (await nim.Hypixel.getBazaar()).products) {
                    this.addItemById(itemID);
                }
                break;
            } catch (e) {
            }

        }

    }
    async logPrices() {
        try {
            var bazar = await nim.Hypixel.getBazaar();
        } catch (e) {
            return;
        }

        for (var it of this) {
            it.addNewPrice(bazar.products[it.id]);
        }
    }
}
/**
 * @class
 * @description Manages Price objects
 */
module.exports.PriceManager = class PriceManager extends Array {
    /**
     * @constructor
     * @param {Item} item Item this price manager belongs to.
     */
    constructor(item) {
        super();
        this.item = item;
    }
    /**
     * 
     * @param {BazaarObject} bazaarObject The bazaar object of the item.
     * @description Adds price to this price manager.
     * @returns {void}
     */
    addPrice(bazaarObject) {
        this.push(new module.exports.Price(bazaarObject, this.item, this));
    }
    /**
     * @description Returns last price
     * @returns {Price} 
     */
    getLastItem() {
        return this[this.length - 1];
    }
    /**
     * @description Gets the stabitity index of the item.
     * @returns {Object<String, StabilityIndex>}
     */
    getStabilityIndex() {

    }

}
/**
 * @class
 * @description Object storing instantaneous price of an Item.
 */
module.exports.Price = class Price {
    /**
     * 
     * @param {BazaarObject} bazaarObject The bazaar object of the item.
     * @param {Item} item The item, which price this object represents.
     * @param {ItemManager} itemManager The item manager, that manages this price.
     */
    constructor(bazaarObject, item, priceManager) {
        this.item = item;
        this.priceManager = priceManager;
        this.timeStamp = new Date().getTime();
        try {
            this.sell = bazaarObject.sell_summary[0].pricePerUnit;
            this.buy = bazaarObject.buy_summary[0].pricePerUnit;
            this.changeSell = this.sell - this.priceManager.getLastItem().sell;
            this.changeBuy = this.buy - this.priceManager.getLastItem().buy;
            this.instantDeprofit = this.buy - this.sell;

        } catch (e) {
            delete this;
        }

    }
}
module.exports.StabilityIndex = class StabilityIndex extends Number {
    /**
     * 
     * @param {Array<Number>} prices Prices to compute the stability index of
     */
    constructor(prices) {
        super();
        if (this < 0) throw new Error("StabilityIndex must be between 0 and 1.");
        if (this > 1) throw new Error("StabilityIndex must be between 0 and 1.");
        if (prices) this.compute(prices);
    }
    /**
     * 
     * @param {Array<Number>} prices Prices to compute the stability index of
     * @returns {void}
     */
    compute(prices) {
        if (prices.filter(p => p == prices[0]).lenght == prices.length) return (this -= this, this += 1, this);
        var pMax = Math.max(...prices);
        var pMin = Math.min(...prices);
        var pMap = newMap(pMin, pMax, 0, 1);
        const max = 1;
        const min = 0;
        const v = prices.map(pMap)
        const avg = v.reduce((r, d) => r + d) / v.length;
        const l = v.length;
        const σ = Math.sqrt(v.reduce((r, d) => r + Math.pow(avg - d)) / (l - 1));
        this -= this;
        this += 0; // TODO
    }
}

function newMap(min, max, endMin, endMax) {
    return (n) => endMin + (n - min) / (max - min) * (endMax - endMin) || 0;
}