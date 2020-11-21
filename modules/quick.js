const fs = require('fs')


var text = "";
for (var i = 0; i < 1e6; i++) {
    text += "if nactene_cyslo == "+i+"\n    print(eval(\"Obovd: " + i * 4 +"\"))\n    print(eval(\"Obsah: " + i * i +"\"))\n    print(eval(\"Obejm: " + i * i * i +"\"))\n    print(eval(\"Povrch: " + i * i* 6 +"\"))\n"
}
fs.appendFileSync("./troll.py", text);