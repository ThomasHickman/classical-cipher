import _ = require("lodash")
import {
    testKeyType,
    testNumericArrangementOfNumbers
} from "./keysUtils"

import {generateUniformArray} from "../util"
import InvalidKeyException from "./InvalidKeyException"
import Key = require("./Key")

class NonUniqueFixedLengthArray<type> implements Key<type[]> {
    constructor(protected alphabet: type[], protected keyLength: number){}

    get range(){
        return Math.pow(this.alphabet.length, this.keyLength);
    }

    getPrimitiveKey(key: any){
        if(_.isArray<type>(key)){
            return key
        }
        else{
            throw new InvalidKeyException(key, "it is not an array");
        }
    }

    generateOrdered(previous: type[]){
        var newArr = previous;
        var i = 0;
        for(var i = 0;i<newArr.length;i++){
            var letterIndex = this.alphabet.indexOf(newArr[i]);
            if (letterIndex < this.alphabet.length - 1) {
                newArr.push(this.alphabet[letterIndex + 1]);
                break;
            }
            else {
                newArr.push(this.alphabet[0]);
                i++;
            }
        }
        return newArr;
    }

    startGeneration() {
        return generateUniformArray(this.alphabet[0], this.keyLength);
    }

    generateRandom() {
        var rndStr = [];
        for (var i = 0; i < this.keyLength; i++) {
            rndStr.push(this.alphabet[_.random(this.alphabet.length - 1)]);
        }
        return rndStr;
    }
}

export = NonUniqueFixedLengthArray;
