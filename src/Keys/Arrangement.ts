import _ = require("lodash")
import {
    testKeyType,
    testNumericArrangementOfNumbers,
    nextPermutation,
    testUniqueArray,
    processKeyGeneratingValue
} from "./keysUtils"
import InvalidKeyException from "./InvalidKeyException"

import Key = require("./Key")

class Arrangement<type> implements Key<type[]>{
    startGeneration() {
        return this.getAlphabet(1);
    }

    get range(){
        return Infinity;
    }

    getPrimitiveKey(key: any){
        testKeyType(key, "array");
        testUniqueArray(key);

        var diff = _.difference(key, this.getAlphabet(key.length))
        if (!_.isEmpty(diff)){
            throw new InvalidKeyException(key, `${diff} ${diff.length == 1?"is":"are"} not in the alphabet`, true)
        }
        else{
            return key;
        }
    }

    generateRandom(keyLength: number = 5/*_.random(1, 10)*/) {
        return _.shuffle(this.getAlphabet(keyLength))
    }

    generateOrdered(previous = this.startGeneration()) {
        return nextPermutation(previous);
    }

    private getAlphabet: (keyLength: number) => type[];

    constructor(alphabet: type[] | ((keyLength: number) => type[])){
        this.getAlphabet = processKeyGeneratingValue(alphabet)
    }
}

export = Arrangement;
