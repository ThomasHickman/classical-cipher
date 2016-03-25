import _ = require("lodash")
import {
    testKeyType,
    testNumericArrangementOfNumbers,
    nextPermutation
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
        if(_.uniq(key).length == key.length && typeof key === "object"){
            return key;
        }
        else{
            throw new InvalidKeyException(key);
        }
    }

    generateRandom(keyLength: number = _.random(1, 10)) {
        return _.shuffle(this.getAlphabet(keyLength))
    }

    generateOrdered(previous = this.startGeneration()) {
        return nextPermutation(previous);
    }

    private getAlphabet: (keyLength: number) => type[];

    constructor(alphabet: type[] | ((keyLength: number) => type[])){
        if(typeof alphabet !== "function"){
            this.getAlphabet = _ => <type[]>alphabet
        }
        else{
            this.getAlphabet = <((keyLength: number) => type[])>alphabet
        }
    }
}

export = Arrangement;
