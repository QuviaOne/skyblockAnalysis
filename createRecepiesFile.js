const fs = require('fs')
const craftSpots = ["A1", "A2", "A3", "B1", "B2", "B3", "C1", "C2", "C3"];
const path = "./items/";
var items = {};
var itemsPath = fs.readdirSync(path);

for (var pth of itemsPath) {
    let itemObj = require(path + pth);
    items[itemObj.internalname] = {
        name: itemObj.internalname,
        craft: []
    }
    for(var cs of craftSpots) {
        if (itemObj.recipe[cs]) items[itemObj.internalname].craft.push(itemObj.recipe[cs]);
    }
}
console.log(JSON.stringify(items));
fs.writeFileSync("./testout.json", JSON.stringify(items, null));