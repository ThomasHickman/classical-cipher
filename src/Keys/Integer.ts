import _ = require("lodash")
import {
    testKeyType,
    testNumericArrangementOfNumbers
} from "./keysUtils"

import InvalidKeyException from "./InvalidKeyException"

import Key = require("./Key")

class Integer implements Key<number>{
    private min: number;
    private max: number;

    getPrimitiveKey(inputKey: string | number){
        var potentialValue: number;
        if(typeof inputKey === "string"){
            potentialValue = parseInt(inputKey);
            if(isNaN(potentialValue)){
                throw new InvalidKeyException(inputKey);
            }
        }
        else{
            potentialValue = inputKey;
        }

        if(potentialValue >= this.min && potentialValue <= this.max){
            return potentialValue;
        }
        else{
            throw new InvalidKeyException(inputKey, "is out of the keys range");
        }
    }

    generateRandom(){
        var rndMin = this.min == -Infinity?-10:this.min;
        var rndMax = this.max == Infinity?10:this.max;

        return _.random(rndMin, rndMax);
    }

    get range(){
        return this.max - this.min;
    }

    startGeneration(){
        return this.min;
    }

    generateOrdered(previous: number){
        return previous == this.max? null : previous + 1;
    }

    constructor(min = -Infinity, max = Infinity){
        this.min = min;
        this.max = max;
    }
}

export = Integer;
