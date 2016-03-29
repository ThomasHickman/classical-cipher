import {Cipher} from "./Cipher"
import keys = require("../keys");
import {
    cMod,
    inverseCantorTuple,
    cantorTuple
} from "./cipherUtil"

import Key = require("../Keys/Key")

import {
    toLetterCode,
    fromLetterCode,
    _throw,
    NotImplementedException
} from "./../util"

import InvalidKeyException from "./../Keys/InvalidKeyException"

import _ = require("lodash")

var hillCiphersInverses = [NaN, 1, NaN, 9, NaN, 21, NaN, 15, NaN, 3, NaN, 19, NaN, NaN, NaN, 7, NaN, 23, NaN, 11, NaN, 5, NaN, 17, NaN, 25];

function isValidKey(key: number[]){
    var det = cMod(key[0] * key[3] - key[1] * key[2], 26);
    var inverseDet = hillCiphersInverses[det];
    if (isNaN(inverseDet))
        return false;
    return true;
}

class HillCipherKey extends keys.NonUniqueFixedLengthArray<number>{
    getPrimitiveKey(key: any){
        var potentialKey = super.getPrimitiveKey(key);
        if(!isValidKey(potentialKey)) throw new InvalidKeyException(key, "is not invertable");
        return potentialKey;
    }

    generateRandom(){
        while(true){
            var potentialKey = super.generateRandom();
            if(isValidKey(potentialKey)){
                return potentialKey;
            }
        }
    }

    generateOrdered(prev: number[]): number[]{
        throw new NotImplementedException();
    }

    constructor(){
        super(_.range(0, 25), 4)
    }
}

class HillCipher extends Cipher<number[]>{
    name = "Hill Cipher"
    keyInfo = <Key<number[]>>(new HillCipherKey())/*new keys.MappedKey<number[]>(
        new keys.Arrangement(keyLength => _.range(0, Math.pow(25, keyLength))),
        oldKey =>  _.flatten(oldKey.map(element => inverseCantorTuple(element, oldKey.length))),
        newKey =>  {
            var matrixSize = Math.sqrt(newKey.length);
            if(!_.isInteger(matrixSize)) return null;
            return _.chunk(newKey, matrixSize).map(row => cantorTuple(row))
        }
    )*/
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
