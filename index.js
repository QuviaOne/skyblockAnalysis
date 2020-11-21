const fs = require('fs');
const nim = require('./modules/networkInteractionModule.js');
const PriceList = require('./modules/priceList');

const REFORGES = ["gentle","odd","fast","fair","epic","sharp","heroic","spicy","legendary","dirty","fabled","suspicious","gilded","warped","salty","treacherous","deadly","fine","grand","hasty","neat","rapid","unreal","awkward","rich","precise","spiritual","clean","fierce","heavy","light","mythic","pure","smart","titanic","wise","perfect","necrotic","spiked","renowned","cubic","reinforced","loving","ridiculous","giant","submerged","absolutely","bizarre","itchy","ominous","pleasant","pretty","shiny","simple","strange","vivid","godly","demonic","forceful","strong","superior","unpleasant","zealous","silky","bloody","shaded","sweet","fruitful","magnetic","refined","blessed","moil","toil"];
const ENCHANTS = [,"big brain","bane of arthropods","feather falling","spiked hook","depth strider","ender slayer","giant killer","luck of the sea","sugar rush","aqua affinity","fire aspect","first strike","infinite quiver","life steal","true protection","silk touch"];
async function main() {
    var player = new nim.User("Topeni123");
    var recepies = require("./recepies.json");
    var items = [];
    var pl = new PriceList();
    await pl.loadBazaarPrices();
    fs.writeFileSync("./output/priceList.json", JSON.stringify(pl))
    var auctions = await nim.Hypixel.getAuctions();
    for (var a of auctions) {
        if (a == null) continue;
        if (REFORGES.includes(a.item_name.split(" ")[0].toLowerCase())) {
            a.item_name = a.item_name.split(" ").splice(1,a.item_name.split(" ").length - 1).join(" ");
        }
        if (a.item_name.startsWith("[Lvl ")) continue;
        if (a.item_name.endsWith("✪")) continue;
        if (a.item_name.includes("Dragon")) continue;
        if (a.item_name.includes("Rune")) continue;
        if (a.item_name == "null") continue;
        if (a.item_name.includes("Potion")) continue;
        if (a.item_name.includes("Minion Skin")) continue;
        if (a.item_name.includes("[VIP]")) continue;
        if (a.item_name.includes("[VIP+]")) continue;
        if (a.item_name.includes("[MVP]")) continue;
        if (a.item_name.includes("[MVP+]")) continue;
        if (a.item_name.includes("[MVP++]")) continue;
        if (a.item_name.includes("[YOUTUBE]")) continue;
        if (a.item_name.includes("[ADMIN]")) continue;
        if (a.item_lore.includes("§7Gear Score")) continue;
        if (a.item_lore.includes("§7Gear Score")) continue;
        if (a.item_name.includes(" Tier ")) continue;
        if (a.item_name == "Enchanted Book") {
            var customName = "Enchanted book: " + a.extra.split(" ").splice(4,a.extra.split(" ").length - 4).join(" ");
            if (customName.split("Enchanted book: ")[1].split(" ").length != 1) {
                if (!ENCHANTS.includes(customName.split("Enchanted book: ")[1].toLowerCase())) continue;
            }
            if (items.filter(i => i.name == customName).length) continue;
            items.push({
                name: customName,
                craft: [{
                    id: "BAZAAR_ITEM_ID",
                    amount: 0
                },
                {
                    id: "BAZAAR_ITEM_ID",
                    amount: 0
                }]
            })
            continue;
        } 
        if (items.filter(i => i.name == a.item_name).length) continue;
        items.push({
            name: a.item_name,
            craft: [{
                id: "BAZAAR_ITEM_ID",
                amount: 0
            },
            {
                id: "BAZAAR_ITEM_ID",
                amount: 0
            }]
        })
    }
    console.log(items.map(v => v.name));
    fs.writeFileSync("./items.json", JSON.stringify(items));

}
main();
