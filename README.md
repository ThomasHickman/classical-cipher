# classical-cipher
Tools for decrypting, encrypting, and solving classical ciphers in JavaScript

## Licence

This project is licensed under the [MIT license (MIT)](LICENSE).

## Features
### Ciphers
- Caesar shift
- Simple substitution cipher
- Vigenère cipher
- Columnar transposition
- Amsco cipher
- Hill cipher
- Railfence cipher

### Statistics
- Chi Squared

### Solvers
- Brute Force
- Hill Climbing

## Planned Features
- Playfair cipher
- Cadence cipher
- Simulated Annealing
- Quadram count
- Bigram rate

## Building

```bash
npm run-script build
```

## Example

```javascript
var cc = require("classical-cipher");

console.log(cc.solvers.bruteForce.solve({
    cipherText: "Alza zaypun!",
    cipher: cc.ciphers.caesarShift,
    stat: cc.stats.chiSquared,
    reporter: cc.reporters.silentReporter
}));// prints { text: 'Test string!', key: 7 }
```
