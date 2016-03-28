import _ = require("lodash")
import {
    testKeyType,
    testNumericArrangementOfNumbers,
    processKeyGeneratingValue
} from "./keysUtils"

import {generateUniformArray} from "../util"
import InvalidKeyException from "./InvalidKeyException"
import Key = require("./Key")

class NonUniqueArrayFromKey<type> implements Key<type[]>{
    constructor(key: Key<type> | ((keyLength) => Key<type>)){
        this.getKey = processKeyGeneratingValue(key);
    }

    get range(){
        return Infinity
    }

    private getKey: (keyLength: number) => Key<type>;

    generateRandom(keyLength = 5){
        var rndArr = [];
        for (var i = 0; i < keyLength; i++) {
            rndArr.push(this.getKey(keyLength).generateRandom());
        }
        return rndArr;
    }

    generateOrdered(previous: type[]){
        var newArr = previous;
        for(var i = 0;i<newArr.length;i++) {
            var nextElement = this.getKey(newArr.length).generateOrdered(previous[i])
            if(nextElement !== null){
                newArr[i] = nextElement;
            }
            else if(i == newArr.length - 1){
                newArr.push(this.getKey(newArr.length + 1).startGeneration())
            }
        }
        return newArr;
    }

    getPrimitiveKey(key: any[]){
        testKeyType(key, "array");
        return key.map(x => this.getKey(key.length).getPrimitiveKey(key));
    }

    startGeneration(){
        return [this.getKey(1).startGeneration()];
    }
}

export = NonUniqueArrayFromKey
