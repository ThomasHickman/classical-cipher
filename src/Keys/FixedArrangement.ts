import _ = require("lodash")
import {
    testKeyType,
    testNumericArrangementOfNumbers,
    nextPermutation
} from "./keysUtils"

import {factorial} from "../util"
import InvalidKeyException from "./InvalidKeyException"

import Key = require("./Key")

class FixedArrangement<type> implements Key<type[]>{
    constructor(private alphabet: type[]) {
    }

    startGeneration() {
        return this.alphabet;
    }

    switchLetters(arr: type[]){
        var letter1Loc = _.random(0, arr.length - 1);
        var letter2Loc = _.random(0, arr.length - 1);

        var tmp = arr[letter1Loc];
        arr[letter1Loc] = arr[letter2Loc];
        arr[letter2Loc] = tmp;

        return arr;
    }

    smallAlteration(arr: type[]){
        return this.switchLetters(arr);
    }

    get range(){
        return factorial(this.alphabet.length)
    }

    getPrimitiveKey(key: any){
        if(_.uniq(key).length == key.length && typeof key === "object"){
            return key;
        }
        else{
            throw new InvalidKeyException(key);
        }
    }

    generateRandom() {
        return _.shuffle(this.alphabet);
    }

    generateOrdered(previous :type[]) {
        return nextPermutation(previous);
    }
}

export = FixedArrangement;
