const nim = require('./networkInteractionModule')
module.exports.BazaarState = class BazaarState extends Array {
    constructor() {
        super();
    }
    async load() {
        /**
         * @type {BazaarObject}
         */
        var bazaarObject = await nim.Hypixel.getBazaar();
        while (!bazaarObject.success) {
            bazaarObject = await nim.Hypixel.getBazaar();
        }
        this.timestamp = bazaarObject.lastUpdated;
        for (var product in bazaarObject.products) {
            var item = new module.exports.BazaarItem(product);
            item.loadPrice(bazaarObject.products[product]);
            this.push(item);
        }
    }
    calculateProfits() {
        /**
         * @type {BazaarItem}
         */
        var item;
        for (item of this) {
            item.calculateProfit();
        }
    }
    /**
     * 
     * @param {Number} amount Amount of best flips
     * @returns {Array<BazaarItem>} 
     */
    getTopProfits(amount) {
        this.calculateProfits();
        this.sort((a, b) => b.price.profit - a.price.profit);
        return this.filter(f => {
            return f.quickStatus.buyMovingWeek * f.price.getBuyPrice() > 1e6 && f.price.getSellPrice() > 50;
        }).slice(0, amount);
    }
    static async getNew() {
        var n = new this();
        await n.load();
        return n;
    }

}
module.exports.Item = class Item {
    /**
     * 
     * @param {String} id Item ID
     */
    constructor(id) {
        this.id = id;
    }
}
module.exports.BazaarItem = class BazaarItem extends module.exports.Item {
    /**
     * 
     * @param {String} id Item ID
     */
    constructor(id) {
        super(id);
        /**
         * @type {QuickStatus}
         */
        this.quickStatus = {};
    }
    /**
     * 
     * @param {ProductObject} productObject 
     */
    loadPrice(productObject) {
        this.price = module.exports.Price.from(new ProductObject(productObject));
        this.quickStatus = new ProductObject(productObject).quick_status;
    }
    calculateProfit() {
        this.price.calculateProfit();
    }
}
module.exports.Vector = class Vector extends Array {
    constructor(...elemnts) {
        super();
        this.push(...elemnts);
    }
    /**
     * @param {Vector} vector Vector to add
     * @returns {Vector} 
     */
    add(vector) {
        if (this.length != vector.length) throw new Error("You can only add vectors of the same length.");
        for (var i = 0; i < vector.length; i++) {
            this[i] += vector[i];
        }
        return this;
    }
}

module.exports.Price = class Price extends module.exports.Vector {
    /**
     * 
     * @param {Number} sellPrice Highest sell price
     * @param {Number} buyPrice Lowest buy price
     */
    constructor(sellPrice, buyPrice) {
        super(sellPrice, buyPrice);
    }
    /**
     * @returns {Number}
     */
    getSellPrice() {
        return this[0];
    }
    /**
     * @returns {Number}
     */
    getBuyPrice() {
        return this[1];
    }
    calculateProfit() {
        /**
         * @type {Profit}
         */
        this.profit = Profit.from(this);
    }
    /**
     * 
     * @param {ProductObject} from 
     * @returns {Price}
     */
    static from(from) {
        if (from.constructor.name === "ProductObject") {
            if (from.sell_summary.length == 0 || from.buy_summary.length == 0) return new Price(0, 0);
            return new Price(from.buy_summary[0].pricePerUnit, from.sell_summary[0].pricePerUnit);
        }
        return new Price(0, 0);
    }
}
class Profit extends Number {
    /**
     * 
     * @param {Number} buy Buy price
     * @param {Number} sell Sell price
     */
    constructor(buy, sell) {
        super(sell / buy);
        this.sell = sell;
        this.buy = buy;
    }
    getAbsolute() {
        return this.sell - this.buy;
    }
    getRelative() {
        return this.sell / this.buy - 1;
    }
    /**
     * 
     * @param {Price} from 
     * @returns {Profit}
     */
    static from(from) {
        if (from.constructor.name == "Price") {
            return new this(from.getBuyPrice(), from.getSellPrice());
        }
    }
}
class ProductObject extends Object {
    constructor(obj) {
        super();
        /**
         * @type {String}
         */
        this["product_id"] = obj.product_id;
        /**
         * @type {Array<SummaryObject>}
         */
        this["sell_summary"] = obj.sell_summary.map(o => new SummaryObject(o));
        /**
         * @type {Array<SummaryObject>}
         */
        this["buy_summary"] = obj.buy_summary.map(o => new SummaryObject(o));
        /**
         * @type {QuickStatus}
         */
        this.quick_status = new QuickStatus(obj.quick_status);
    }
}
class SummaryObject extends Object {
    constructor(obj) {
        super();
        /**
         * @type {Number}
         */
        this.amount = obj.amount;
        /**
         * @type {Number}
         */
        this.pricePerUnit = obj.pricePerUnit;
        /**
         * @type {Number}
         */
        this.orders = obj.orders;
    }
}
class QuickStatus extends Object {
    constructor(obj) {
        super();
        /**
         * @type {String}
         */
        this.productId = obj.productId;
        /**
         * @type {Number}
         */
        this.sellPrice = obj.sellPrice;
        /**
         * @type {Number}
         */
        this.sellVolume = obj.sellVolume;
        /**
         * @type {Number}
         */
        this.sellMovingWeek = obj.sellMovingWeek;
        /**
         * @type {Number}
         */
        this.sellOrders = obj.sellOrders;
        /**
         * @type {Number}
         */
        this.buyPrice = obj.buyPrice;
        /**
         * @type {Number}
         */
        this.buyVolume = obj.buyVolume;
        /**
         * @type {Number}
         */
        this.buyMovingWeek = obj.buyMovingWeek;
        /**
         * @type {Number}
         */
        this.buyOrders = obj.buyOrders;
    }
}
class BazaarObject extends Object {
    constructor(obj) {
        super();
        /**
         * @type {Boolean}
         */
        this.success = obj.success;
        /**
         * @type {Number}
         */
        this.lastUpdated = obj.lastUpdated;
        /**
         * @type {Map<String, ProductObject>}
         */
        this.products = obj.products;
    }
}
