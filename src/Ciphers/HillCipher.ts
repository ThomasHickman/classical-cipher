import {Cipher} from "./Cipher"
import keys = require("../keys");
import {
    cMod
} from "./HelperFunctions"

import {
    toLetterCode,
    fromLetterCode
} from "./../util"

import _ = require("lodash")

var hillCiphersInverses = [NaN, 1, NaN, 9, NaN, 21, NaN, 15, NaN, 3, NaN, 19, NaN, NaN, NaN, 7, NaN, 23, NaN, 11, NaN, 5, NaN, 17, NaN, 25];

class HillCipher extends Cipher<number[]>{
    name = "Hill Cipher";
    keyInfo = new keys.FixedArrangement(_.range(0, 25));
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
}

export = HillCipher
