import Key = require("./Key")
import Arrangement = require("./Arrangement")

import {
    testKeyType,
    testNumericArrangementOfNumbers,
    nextPermutation
} from "./keysUtils"

import _ = require("lodash")

class NumericArrangement extends Arrangement<number> implements Key<number[]>{
    constructor(){
        super(keyLength => _.range(0, keyLength - 1));
    }

    getPrimitiveKey(key: any){
        var numericArrangement = testNumericArrangementOfNumbers(key);
        var minimumElement = _.min(numericArrangement)
        return super.getPrimitiveKey(numericArrangement.map(x => x - minimumElement)/*0 index the array*/);
    }
}

export = NumericArrangement
