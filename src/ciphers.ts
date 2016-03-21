import _ = require("lodash");
import Keys = require("./keys")

module ciphers {
    export function pageLoad() {
        allCiphers.sort((cipherA, cipherB) => cipherA.keyInfo.occurences - cipherB.keyInfo.occurences);
    }

    //Globals
    export var allCiphers = <Array<Cipher<any>>>[];
    //Cipher Class
    export interface solvedCipherInfo<keyType> {
        key: keyType;
        solution: string;
    }
    export interface CipherProps<keyType> {
        name: string;
        encrypt: (input: string, key: keyType) => string;
        decrypt: (input: string, key: keyType) => string;
        keyInfo: Keys.cipherKeyInfo<keyType>;
    }
    export class Cipher<keyType>{
        private testKeyType(key: any, initInfo: CipherProps<keyType>) {
            var mappedKey = key;
            if (typeof (key) == "string") {
                mappedKey = (<string>mappedKey.toUpperCase());
            }
            if (initInfo.keyInfo.converstions !== undefined) {
                if (typeof (key) !== typeof (initInfo.keyInfo.startGen())) {
                    initInfo.keyInfo.converstions.every((el) => {
                        if (el.typeFrom == typeof (key)) {
                            mappedKey = el.convert(mappedKey);
                            return false;
                        }
                        return true;
                    });
                }
            }
            return <keyType>mappedKey;
        }
        constructor(initInfo: CipherProps<keyType>) {
            allCiphers.push(this);
            this.decrypt = (input: string, key: any) => {
                return allCapsToFormattedText(initInfo.decrypt(formattedTextToAllCaps(input), this.testKeyType(key, initInfo)), input)
            };
            this.encrypt = (input: string, key: any) => {
                return allCapsToFormattedText(initInfo.encrypt(formattedTextToAllCaps(input), this.testKeyType(key, initInfo)), input);
            }
            this.keyInfo = initInfo.keyInfo;
            this.name = initInfo.name;
            this.nonFormatting = {
                decrypt: initInfo.decrypt,
                encrypt: initInfo.encrypt
            }
        }
        name: string;
        encrypt: (input: string, key: any) => string;
        decrypt: (input: string, key: any) => string;
        nonFormatting: {
            encrypt: (input: string, key: keyType) => string;
            decrypt: (input: string, key: keyType) => string;
        }
        solve: (x: void) => solvedCipherInfo<keyType>;
        keyInfo: Keys.cipherKeyInfo<keyType>;
    }
    function forEachLetterFromSt(input: string, func: (inp: string, pos: number) => number) {
        var output = "";
        for (var i = 0; i < input.length; i++) {
            output += String.fromCharCode(func(input[i], i) + 65);
        }
        return output;
    }

    function forEachLetterToSt(input: string, func: (inp: number, pos: number) => string) {
        var output = "";
        for (var i = 0; i < input.length; i++) {
            var charCode = input[i].charCodeAt(0);
            output += func(charCode - 65, i);
        }
        return output;
    }

    function forEachLetter(input: string, func: (inp: number, pos: number) => number) {
        var output = "";
        for (var i = 0; i < input.length; i++) {
            var charCode = input[i].charCodeAt(0);
            output += String.fromCharCode(func(charCode - 65, i) + 65);
        }
        return output;
    }

    export var cMod = (num: number, amount: number) => num > 0 ? num % amount : (amount + ((num) % amount)) % amount;

    export var caesarShift = new Cipher<number>({
        name: "Caesar Shift",
        keyInfo: Keys.numbers(0, 25),
        encrypt: (input: string, key: number) => forEachLetter(input, (inp: number) => cMod((inp + key), 26)),
        decrypt: (input: string, key: number) => forEachLetter(input, (inp: number) => cMod((inp - key), 26))
    });

    var hillCiphersInverses = [NaN, 1, NaN, 9, NaN, 21, NaN, 15, NaN, 3, NaN, 19, NaN, NaN, NaN, 7, NaN, 23, NaN, 11, NaN, 5, NaN, 17, NaN, 25];

    export var hillCipher = new Cipher<number[]>({
        name: "Hill Cipher",
        keyInfo: new Keys.repeatedNumbers({ from: 0, to: 25 }),
        encrypt: (input: string, key: number[]) => {
            var retValue = "";
            var matrixDimentions = Math.sqrt(key.length);
            if (input.length % matrixDimentions !== 0)
                throw Error("Input not a muliple of " + matrixDimentions);
            for (var i = 0; i < input.length; i += 2) {
                var nGram = input.slice(i, i + matrixDimentions).split("");
                var numNGram = nGram.map((el) => toLetterCode(el));
                for (var x = 0; x < matrixDimentions; x++) {
                    var sum = 0;
                    for (var y = 0; y < matrixDimentions; y++) {
                        sum += key[y + x * matrixDimentions] * numNGram[y];
                    }
                    retValue += fromLetterCode(cMod(sum, 26));
                }
            }
            return retValue;
        },
        decrypt: (input: string, key: number[]) => {
            var retValue = "";
            if (input.length % 2 !== 0)
                throw Error("Input not a muliple of 2");
            var det = cMod(key[0] * key[3] - key[1] * key[2], 26);
            var inverseDet = hillCiphersInverses[det];
            if (isNaN(inverseDet))
                return "";
            for (var i = 0; i < input.length; i += 2) {
                var biGram = input.slice(i, i + 2);
                var numBiGram = [toLetterCode(biGram[0]), toLetterCode(biGram[1])];
                retValue += fromLetterCode(cMod((key[3] * numBiGram[0] - key[1] * numBiGram[1]) * inverseDet, 26));
                retValue += fromLetterCode(cMod((- key[2] * numBiGram[0] + key[0] * numBiGram[1]) * inverseDet, 26));
            }
            return retValue;
        }
    });
    export var cTrans = new Cipher<number[]>({
        name: "Columnar Transposition",
        keyInfo: new Keys.arrangementOfNumbers(),
        encrypt: (input: string, key: number[]) => {
            if (input.length % key.length != 0) {
                var inputLen = input.length;
                for (var i = 0; i < key.length - (inputLen % key.length); i++) {
                    input += "x";
                }
            }
            var coloums = <Array<string>>[];
            key.forEach((el) => {
                coloums[el] = "";
                for (var o = el; o < input.length; o += key.length) {
                    coloums[el] += input[o];
                }
            });
            return coloums.join("");
        },
        decrypt: (input: string, key: number[]) => {
            if (input.length % key.length != 0) {
                var inputLen = input.length;
                for (var i = 0; i < key.length - (inputLen % key.length); i++) {
                    input += "x";
                }
            }
            var newGridLength = input.length / key.length;
            var newStr = "";
            key.forEach((el) => {
                newStr += input.substr(el * newGridLength, newGridLength);
            });
            var coloums = <Array<string>>[];
            for (var i = 0; i < newGridLength; i++) {
                coloums[i] = "";
                for (var o = i; o < newStr.length; o += newGridLength) {
                    coloums[i] += newStr[o];
                }
            };
            return coloums.join("");
        }
    })
    export function reArrangefrom<type>(arrToReArrange: type[], order: number[]) {
        var retValue = <[type, number][]>arrToReArrange.map((el, i) => [el, order[i]]);
        retValue.sort((a, b) => a[1] - b[1]);
        return retValue.map((el) => el[0]);
    }
    export function applyPermutation<type>(arr: type[], permutation: number[]) {
        /**
         * Applies a permuation to arr
         */
        var retValue: type[] = new Array(permutation.length);
        permutation.forEach((el, i) => retValue[i] = arr[el - 1]);
        return retValue;
    }
    export function transpose<type>(arr: type[]){
        return <type[]>_.zip.apply(_, arr)
    }
    export function longFindColLength(what: string, key: number[]) {
        var retValue = Array(key.length).fill(0);
        var o = 0;
        for (var i = 0; i < what.length; o++) {
            if (o % 2 == 1) {
                i++;
                retValue[o % key.length]++;
            }
            else {
                i += 2;
                retValue[o % key.length] += 2;
            }
        }
        return reArrangefrom(retValue, key);
    }
    function seperateNgrams(what: string, n: number) {
        var retValue = <string[]>[];
        for (var i = 0; i < what.length; i++) {
            retValue.push(what.slice(i, i + n));
            i += n;
        }
        return retValue;
    }
    export function arrayOutOdd(input: string, startsWith2: boolean) {
        var retValue = <string[]>[];
        for (var i = 0, o = 0; i < input.length; o++) {
            if ((o % 2 == 0) == startsWith2) {
                retValue.push(input.slice(i, i + 2));
                i += 2;
            }
            else {
                retValue.push(input.slice(i, i + 1));
                i += 1;
            }
        }
        return retValue;
    }
    export function arrayOutEven(input: string, startsWith2: boolean) {
        if (startsWith2)
            return seperateNgrams(input, 1);
        else
            return seperateNgrams(input, 1);
    }/*
    export function intersect<type>(input: type[][]) {
        var reflect = <type[][]>[][];
        for (var i = 0; i < input.length; i++) {
            for (var o = 0; o < input[i].length; o++) {
                reflect[o].push(input[o][i]);
            }
        }
        return reflect.;
    }*/
    export var amsco = new Cipher<number[]>({
        name: "amsco",
        decrypt: (input: string, key: number[]) => {
            var retValue = [];
            var rowLengths = longFindColLength(input, key);
            var init2StartDis = <boolean[]>[];
            for (var i = 0; i < key.length; i++) {
                if (i % 2 == 0)
                    init2StartDis.push(true)
                else
                    init2StartDis.push(false)
            }
            init2StartDis = reArrangefrom(init2StartDis, key);
            var func;
            if (key.length % 2 == 0) {
                func = arrayOutEven;
            }
            else {
                func = arrayOutOdd;
            }
            var sum = 0, sum1 = 0, rowCombs = [];
            rowLengths.forEach((el, i) => {
                sum1 += el;
                rowCombs.push(func(input.slice(sum, sum1), init2StartDis[i]))
                sum += el;
            });
            var reArranged = applyPermutation(rowCombs, key);
            return _.flatten(_.zip.apply(_, reArranged)).join("");
        },
        encrypt: (input: string, key: number[]) => {
            var groups =  <string[][]>
                    transpose(
                    _.chain(input.split(""))
                    .chunk(3)
                    .map(arr => _.chunk(arr, 2).map(x => x.join("")))
                    .flatten()//Split into x xx ...
                    .chunk(5)
                    .value())
            return _.flatten(transpose(applyPermutation(groups, key))).join("")
        },
        keyInfo: new Keys.arrangementOfNumbers()
    });
    export var simpleSubstitution = new Cipher<string>({
        name: "Simple Substitution",
        keyInfo: new Keys.arrangementOfLetters(uppercaseLetters),
        encrypt: (input: string, key: string) => forEachLetterToSt(input, (el) => key[el]),
        decrypt: (input: string, key: string) => forEachLetterFromSt(input, (el) => key.search(el))
    })
    //TODO: enable cadenus cipher
    /*
    export var cadenus = new Cipher<number[]>({
        name: "Cadenus",
        keyInfo: new keyRanges.repeatedNumbers({
            from: 0,
            to: 25,//TODO: improve this
        }),
        encrypt: (input: string, key: number[]) => "",
        decrypt: (input: string, key: number[]) => {
            var groups = []
            var keyLength = key.length;
            var inputLength = input.length;
            for (var qw = 0; qw < keyLength; qw++) {
                groups.push("")
            }
            for (var i = 0; i < inputLength; i++) {
                groups[i % keyLength] += input[i]
            }
            var groupsLength = groups.length;
            var retValue = new Array(groupsLength);
            for (var i = 0; i < groupsLength; i++) {
                var groupsi = groups[i], keyi = key[i];
                retValue[i] = groupsi.slice(keyi) + groupsi.slice(0, keyi);
            }
            retValue = ciphers.applyPermutation(retValue, permutations);
            var unZipped = Array(inputLength);
            for (var i = 0; i < inputLength; i++) {
                unZipped[i] = retValue[i % keyLength][~~(i / keyLength)]; // ~~ == Math.floor
            }
            return unZipped.join("");
        }
    })*/
    export var railFence = new Cipher<number>({
        name: "Rail Fence",
        keyInfo: Keys.numbers(2, 50),
        encrypt: (input: string, key: number) => {
            var load = false; // Whether the thing is going down or up
            var level = 0; //Where you are horizontally
            var steps = []; //The collection of steps
            for (var i = 0; i < input.length; i++) {
                if (steps[level] == undefined) {
                    steps[level] = [];
                }
                steps[level].push(input[i]);
                if (load)
                    level++;
                else
                    level--;

                if (level == key - 1)
                    load = false;
                if (level == 0)
                    load = true;
            }
            var retValue = "";
            for (var i = 0; i < key; i++) {
                retValue += steps[i].join("");
            }
            return retValue;
        },
        decrypt: (input: string, key: number) => {
            var position;
            var plainText = [];
            //Beginning
            var i = 0;
            for (var row = 0; row < key; row++) {
                position = row;
                while (position < input.length) {
                    plainText[position] = input[i];
                    if (row == 0 || row == key - 1 || position + (key - row - 1) * 2 >= input.length)
                        i++;
                    else {
                        plainText[position + (key - row - 1) * 2] = input[i + 1];
                        i += 2;
                    }
                    position += key * 2 - 2;
                }
            }
            return plainText.join("");
        }
    })
    export var playfair = new Cipher({
        name: "Playfair",
        keyInfo: new Keys.arrangementOfLetters("ABCDEFGHIKLMNOPQRSTUVWXYZ"),
        encrypt: (input: string, key: string) => {
            console.error("Not Implemented"); return ""
        },
        decrypt: (input: string, key: string) => {
            var size = 5;
            function getsquareletter(x, y) {
                var retvalue = key[(y - 1) + ((x - 1) * size)];
                if (retvalue == "_") {
                    // Blank charater
                    invaidlettergot = true;
                    retvalue = "a";
                }
                return retvalue;
            }
            function getsquarepos(letter) {
                var pos = key.indexOf(letter);
                if (pos == -1) {
                    invaidlettergot = true;
                    pos = 0;
                }
                return [Math.floor((pos / size) + 1), (pos % size) + 1];
            }
            //square = removespaces(square.toUpperCase());
            if (size == undefined)
                size = 5;
            var invaidlettergot = false;
            if (input.length % 2 != 0) {
                console.log("SolvePlayfair: code passed to function has an odd length");
                return "";
            }
            var finalst = "";
            for (var i = 0; i < input.length; i += 2) {
                var a = input[i];
                var b = input[i + 1];
                var sqposa = getsquarepos(a);
                var sqposb = getsquarepos(b);
                /*
                 * if (a == b) { //Same letter //Replace second letter with x finalst +=
                 * a + "X"; i -= 2; what = finalst; } else
                 */if (sqposa[0] == sqposb[0]) {
                    // Same row
                    // Get letter below
                    // 1st
                    if (sqposa[1] == 1) {
                        // Wrap round
                        finalst += getsquareletter(sqposa[0], size);
                    } else {
                        finalst += getsquareletter(sqposa[0], sqposa[1] - 1);
                    }
                    // 2nd
                    if (sqposb[1] == 1) {
                        // Wrap round
                        finalst += getsquareletter(sqposb[0], size);
                    } else {
                        finalst += getsquareletter(sqposb[0], sqposb[1] - 1);
                    }
                } else if (sqposa[1] == sqposb[1]) {
                    // Same collom
                    // Get letter across
                    // 1st
                    if (sqposa[0] == 1) {
                        // Wrap round
                        finalst += getsquareletter(size, sqposa[1]);
                    } else {
                        finalst += getsquareletter(sqposa[0] - 1, sqposa[1]);
                    }
                    // 2nd
                    if (sqposb[0] == 1) {
                        // Wrap round
                        finalst += getsquareletter(size, sqposb[1]);
                    } else {
                        finalst += getsquareletter(sqposb[0] - 1, sqposb[1]);
                    }
                } else {
                    // No trend
                    // Do rectangle
                    // 1st
                    finalst += getsquareletter(sqposa[0], sqposb[1]);
                    // 2nd
                    finalst += getsquareletter(sqposb[0], sqposa[1]);
                }
                // See if an invalid letter has been used and replace it with _
                if (invaidlettergot) {
                    invaidlettergot = false;
                    // Take off final 2 letters
                    finalst = finalst.slice(0, finalst.length - 2);
                    // Replace with blanks
                    finalst += "_";
                    finalst += "_";
                }
            }
            return finalst;
        }
    });
    export var vigenere = new Cipher({
        name: "Vigenère",
        decrypt: (input: string, key: string) => forEachLetter(input, (letter, n) => cMod(letter - toLetterCode(key[(n % key.length)]), 26)),
        encrypt: (input: string, key: string) => forEachLetter(input, (letter, n) => cMod(letter + toLetterCode(key[(n % key.length)]), 26)),
        keyInfo: new Keys.repeatedLetters(uppercaseLetters)
    });
}

export = ciphers
