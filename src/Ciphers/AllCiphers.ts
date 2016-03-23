import {Cipher} from "./../Cipher"
import Keys = require("./../Keys");
import {
    letterCodeMap,
    cMod,
    undoPermutation,
    applyPermutation,
    transpose,
    letterCodeInputMap,
    letterCodeOutputMap
} from "./HelperFunctions"

import {
    toLetterCode,
    fromLetterCode,
    uppercaseLetters,
    factorial,
    generateUniformArray
} from "./../common.ts"

export var caesarShift = new(class extends Cipher<number>{
    name = "Caesar Shift";
    keyInfo = new Keys.Integer(0, 25);
    rawEncrypt(input: string, key: number){
        return letterCodeMap(input, (inp: number) => cMod((inp + key), 26))
    }
    rawDecrypt(input: string, key: number){
        return letterCodeMap(input, (inp: number) => cMod((inp - key), 26))
    }
})

var hillCiphersInverses = [NaN, 1, NaN, 9, NaN, 21, NaN, 15, NaN, 3, NaN, 19, NaN, NaN, NaN, 7, NaN, 23, NaN, 11, NaN, 5, NaN, 17, NaN, 25];

export var hillCipher = new(class extends Cipher<number[]>{
    name = "Hill Cipher";
    keyInfo = new Keys.repeatedNumbers({ from: 0, to: 25 });
    rawEncrypt(input: string, key: number[]) {
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
    }
    rawDecrypt(input: string, key: number[]) {
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
})

export var columnarTransposition = new(class extends Cipher<number[]>{
    name = "Columnar Transposition";
    keyInfo = new Keys.arrangementOfNumbers()
    rawEncrypt(input: string, key: number[]) {
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
    }
    rawDecrypt(input: string, key: number[]) {
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

export var amsco = new(class Amsco extends Cipher<number[]>{
    name = "amsco";
    keyInfo = new Keys.arrangementOfNumbers();
    private getAmscoColumns(input: string, keyLength: number){
        return <string[][]>transpose(
                _.chain(input.split(""))
                .chunk(3)
                .map(arr => _.chunk(arr, 2).map(x => x.join("")))
                .flatten()
                .chunk(keyLength)
                .value())
    }
    rawDecrypt(input: string, key: number[]) {
        return _.flatten(transpose(undoPermutation(this.getAmscoColumns(input, key.length), key))).join("")
    }
    rawEncrypt(input: string, key: number[]){
        return _.flatten(transpose(applyPermutation(this.getAmscoColumns(input, key.length), key))).join("")
    }
})

export var simpleSubstitution = new(class extends Cipher<string>{
    name = "Simple Substitution";
    keyInfo = new Keys.arrangementOfLetters(uppercaseLetters)
    rawEncrypt (input: string, key: string){
        return letterCodeInputMap(input, (el) => key[el])
    }
    rawDecrypt (input: string, key: string){
        return letterCodeOutputMap(input, (el) => key.search(el))
    }
})

export var playfair = new(class extends Cipher<string>{
    name = "Playfair"
    keyInfo = new Keys.arrangementOfLetters("ABCDEFGHIKLMNOPQRSTUVWXYZ")
    rawEncrypt(input: string, key: string) {
        console.error("Not Implemented"); return ""
    }
    rawDecrypt(input: string, key: string) {
        var size = 5;
        function getSquareLetter(x, y) {
            var retvalue = key[(y - 1) + ((x - 1) * size)];
            if (retvalue == "_") {
                // Blank charater
                invaidlettergot = true;
                retvalue = "a";
            }
            return retvalue;
        }
        function getSquarePos(letter) {
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
            var sqposa = getSquarePos(a);
            var sqposb = getSquarePos(b);
            /*
             * if (a == b) { //Same letter //Replace second letter with x finalst +=
             * a + "X"; i -= 2; what = finalst; } else
             */if (sqposa[0] == sqposb[0]) {
                // Same row
                // Get letter below
                // 1st
                if (sqposa[1] == 1) {
                    // Wrap round
                    finalst += getSquareLetter(sqposa[0], size);
                } else {
                    finalst += getSquareLetter(sqposa[0], sqposa[1] - 1);
                }
                // 2nd
                if (sqposb[1] == 1) {
                    // Wrap round
                    finalst += getSquareLetter(sqposb[0], size);
                } else {
                    finalst += getSquareLetter(sqposb[0], sqposb[1] - 1);
                }
            } else if (sqposa[1] == sqposb[1]) {
                // Same collom
                // Get letter across
                // 1st
                if (sqposa[0] == 1) {
                    // Wrap round
                    finalst += getSquareLetter(size, sqposa[1]);
                } else {
                    finalst += getSquareLetter(sqposa[0] - 1, sqposa[1]);
                }
                // 2nd
                if (sqposb[0] == 1) {
                    // Wrap round
                    finalst += getSquareLetter(size, sqposb[1]);
                } else {
                    finalst += getSquareLetter(sqposb[0] - 1, sqposb[1]);
                }
            } else {
                // No trend
                // Do rectangle
                // 1st
                finalst += getSquareLetter(sqposa[0], sqposb[1]);
                // 2nd
                finalst += getSquareLetter(sqposb[0], sqposa[1]);
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
})

export var vigenere = new(class extends Cipher<string>{
    name = "Vigenère";
    keyInfo = new Keys.repeatedLetters(uppercaseLetters)
    rawDecrypt(input: string, key: string){
        return letterCodeMap(input, (letter, n) => cMod(letter - toLetterCode(key[(n % key.length)]), 26))
    };
    rawEncrypt(input: string, key: string){
        return letterCodeMap(input, (letter, n) => cMod(letter + toLetterCode(key[(n % key.length)]), 26))
    }
})
