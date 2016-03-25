import _ = require("lodash");

var cipherNames = [
    "Amsco",
    "CaesarShift",
    "ColumnTransposition",
    "HillCipher",
    "Playfair",
    "SimpleSubstitution",
    "Vigenere"
]
function getCiphersExportStr(ciphers){
    return ciphers.map(cipherName => `import ${cipherName} = require("./Ciphers/${cipherName}");`).join("\n") + "\n\n"
         + ciphers.map(cipherName => `export var ${_.lowerFirst(cipherName)} = new ${cipherName}();`).join("\n")
}
console.log(getCiphersExportStr(cipherNames))//TODO: output this into Ciphers.ts
