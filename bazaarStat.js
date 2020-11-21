const { Item, ItemManager } = require('./modules/bazaarStatClasses.js');
const { performance } = require('perf_hooks');
const UPDATE_INTERVAL = 2000;
const items = new ItemManager();
const main = async () => {
    await items.loadItems();
    console.log(items[0].prices[0]);

    setInterval(loopFunction, UPDATE_INTERVAL)
}



main();

const loopFunction = async () => {
    await items.logPrices();
    console.log("Size: " + roughSizeOfObject(items)/1024/8 + " KB");
}



function roughSizeOfObject( object ) {

    var objectList = [];
    var stack = [ object ];
    var bytes = 0;

    while ( stack.length ) {
        var value = stack.pop();

        if ( typeof value === 'boolean' ) {
            bytes += 4;
        }
        else if ( typeof value === 'string' ) {
            bytes += value.length * 2;
        }
        else if ( typeof value === 'number' ) {
            bytes += 8;
        }
        else if
        (
            typeof value === 'object'
            && objectList.indexOf( value ) === -1
        )
        {
            objectList.push( value );

            for( var i in value ) {
                stack.push( value[ i ] );
            }
        }
    }
    return bytes;
}