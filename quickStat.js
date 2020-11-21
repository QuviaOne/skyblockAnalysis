const nim = require('./modules/networkInteractionModule.js');
require('colors');
const { performance } = require('perf_hooks');
const PRICE_DIFF = 0.01;
const TIME_DIFF = 10000;
const WAIT_BEFORE_NEXT_UPDATE_AFTER_UPDATE = 500;
var item = process.argv[2];
var prev = [{
    buy: 0,
    sell: 0,
    time: performance.now()
}];
console.clear()
setTerminalTitle("Hypixel Skyblock market: " + item);
async function a() {
    var b = await nim.Hypixel.getBazaar();
    // console.log(b.products[item]);
    console.log("Sell: " + b.products[item].sell_summary[0].pricePerUnit + " Buy: " + b.products[item].buy_summary[0].pricePerUnit + " Flip diff: " + (b.products[item].buy_summary[0].pricePerUnit - b.products[item].sell_summary[0].pricePerUnit))
    await a();
}
async function loop() {
    while (true) {
        try {
            var b = await nim.Hypixel.getBazaar();
        } catch (e) {
            continue;
        }
        if (b.products.length == 0) continue;
        if (Math.abs(prev[prev.length - 1].sell - b.products[item].sell_summary[0].pricePerUnit) < PRICE_DIFF) continue;
        prev.push({
            sell: b.products[item].sell_summary[0].pricePerUnit,
            buy: b.products[item].buy_summary[0].pricePerUnit,
            time: performance.now()
        })
        var ls = "" + new Date().getHours().toString().padStart(2, "0") + ":" + new Date().getMinutes().toString().padStart(2, "0") + ":" + new Date().getSeconds().toString().padStart(2, "0") + " - "
        ls = "Sell: " + Math.round(prev[prev.length - 1].sell).toString().padStart(prev[0].sell.toString().length, "0") + " Buy: " + Math.round(prev[prev.length - 1].buy) + "    ";

        if (prev.length == 2) {
            ls += "  " + (TIME_DIFF / 1000) + " s      |   " + (TIME_DIFF / 1000 * 18) + " s";
            console.log(ls);
            setTerminalTitle("Hypixel Skyblock market: " + item + "   |    Buy-Sell difference: " + (prev[prev.length - 1].buy - prev[prev.length - 1].sell).toFixed(3) + "   |    Insta buy amount: " + b.products[item].sell_summary[0].amount + " ~ " + (b.products[item].sell_summary[0].amount * b.products[item].sell_summary[0].pricePerUnit).toPrecision(b.products[item].sell_summary[0].pricePerUnit.toString().length - 2));
            await wait(WAIT_BEFORE_NEXT_UPDATE_AFTER_UPDATE);
            continue;
        }
        for (var i = prev.length - 1; i >= 0; i--) {
            if (Math.abs(prev[i].time - performance.now()) > TIME_DIFF) {
                if (prev[i].sell < b.products[item].sell_summary[0].pricePerUnit) ls += ("+" + (b.products[item].sell_summary[0].pricePerUnit - prev[i].sell).toFixed(2)).padEnd(10, " ").green;
                if (prev[i].sell > b.products[item].sell_summary[0].pricePerUnit) ls += ("-" + (prev[i].sell - b.products[item].sell_summary[0].pricePerUnit).toFixed(2)).padEnd(10, " ").red;
                if (prev[i].sell == b.products[item].sell_summary[0].pricePerUnit) ls+= " 0".orange;
                break;
            }
        }
        if (ls == "Sell: " + Math.round(prev[prev.length - 1].sell) + " Buy: " + Math.round(prev[prev.length - 1].buy) + "    ") {
            if (prev[1].sell < b.products[item].sell_summary[0].pricePerUnit) ls += ("+" + (b.products[item].sell_summary[0].pricePerUnit - prev[1].sell).toFixed(2)).padEnd(10, " ").green;
            if (prev[1].sell > b.products[item].sell_summary[0].pricePerUnit) ls += ("-" + (prev[1].sell - b.products[item].sell_summary[0].pricePerUnit).toFixed(2)).padEnd(10, " ").red;
            if (prev[1].sell == b.products[item].sell_summary[0].pricePerUnit) ls+= " 0".orange;
        }
        ls += "  |  "
        var done = false;
        for (var i = prev.length - 1; i >= 0; i--) {
            if (Math.abs(prev[i].time - performance.now()) > TIME_DIFF * 18) {
                if (prev[i].sell < b.products[item].sell_summary[0].pricePerUnit) ls += ("+" + (b.products[item].sell_summary[0].pricePerUnit - prev[i].sell).toFixed(2)).padEnd(10, " ").green;
                if (prev[i].sell > b.products[item].sell_summary[0].pricePerUnit) ls += ("-" + (prev[i].sell - b.products[item].sell_summary[0].pricePerUnit).toFixed(2)).padEnd(10, " ").red;
                if (prev[i].sell == b.products[item].sell_summary[0].pricePerUnit) ls+= " 0".orange;
                done = true;
                break;
            }
        }
        if (!done) {
            if (prev[1].sell < b.products[item].sell_summary[0].pricePerUnit) ls += ("+" + (b.products[item].sell_summary[0].pricePerUnit - prev[1].sell).toFixed(2)).padEnd(10, " ").green;
            if (prev[1].sell > b.products[item].sell_summary[0].pricePerUnit) ls += ("-" + (prev[1].sell - b.products[item].sell_summary[0].pricePerUnit).toFixed(2)).padEnd(10, " ").red;
            if (prev[1].sell == b.products[item].sell_summary[0].pricePerUnit) ls+= " 0".orange;
        }
        console.log(ls);
        setTerminalTitle("Hypixel Skyblock market: " + item + "   |    Buy-Sell difference: " + (prev[prev.length - 1].buy - prev[prev.length - 1].sell).toFixed(3) + "   |    Insta buy amount: " + b.products[item].sell_summary[0].amount + " ~ " + (b.products[item].sell_summary[0].amount * b.products[item].sell_summary[0].pricePerUnit).toPrecision(b.products[item].sell_summary[0].pricePerUnit.toString().length - 2) + "   |   Update No. " + prev.length);
        await wait(WAIT_BEFORE_NEXT_UPDATE_AFTER_UPDATE);
    }
}

function wait(t) {
    return new Promise(resolve => {
        setTimeout(resolve, t)
    })
}
loop();
function setTerminalTitle(title) {
    process.stdout.write(
        String.fromCharCode(27) + "]0;" + title + String.fromCharCode(7)
    );
}