import InvalidKeyException from "./InvalidKeyException"
import _ = require("lodash");

/*
 * Next lexicographical permutation algorithm (JavaScript)
 * by Project Nayuki, 2014. Public domain.
 * https://www.nayuki.io/page/next-lexicographical-permutation-algorithm
 */
export function nextPermutation<t>(array: t[]) {
    // Find non-increasing suffix
    var i = array.length - 1;
    while (i > 0 && array[i - 1] >= array[i])
        i--;
    if (i <= 0)
        return [];

    // Find successor to pivot
    var j = array.length - 1;
    while (array[j] <= array[i - 1])
        j--;
    var temp = array[i - 1];
    array[i - 1] = array[j];
    array[j] = temp;

    // Reverse suffix
    j = array.length - 1;
    while (i < j) {
        temp = array[i];
        array[i] = array[j];
        array[j] = temp;
        i++;
        j--;
    }
    return array;
}

export function testKeyType(key: any, expectedType: "number"): key is number;
export function testKeyType(key: any, expectedType: "string"): key is string;
export function testKeyType(key: any, expectedType: "object"): key is Object;
export function testKeyType(key: any, expectedType: "array"): key is any[];
export function testKeyType<T>(key: any, expectedType: T): key is T;
export function testKeyType<T extends Function>(key: any, expectedType: "number" | "string" | "object" | "array" | T){
    if(expectedType == "array"){
        if(!_.isArray(key)){
            throw new InvalidKeyException(key, "is not an array")
        }
    }
    else if(typeof expectedType === "object"){
        if(!(key instanceof expectedType)){
            throw new InvalidKeyException(key, "is not an instance of" + expectedType.toString())
        }
    }
    else if(typeof key !== expectedType){
        throw new InvalidKeyException(key, "is not of type " + expectedType)
    }
    else{
        return true;
    }
}

export function testUniqueArray(key: any[]){
    if(_.uniq(key).length !== key.length){
        throw new InvalidKeyException(key, "is not array with unique elements");
    }
}

export function processKeyGeneratingValue<T>(value: T | ((keyLength: number) => T)): (keyLength: number) => T{
    if(typeof value !== "function"){
        return _ => <T>value
    }
    else{
        return <((keyLength: number) => T)>value
    }
}

export function testNumericArrangementOfNumbers(key: number[] | string){
    if(_.isArray(key) && key.every(el => typeof el == "number")){
        return key;
    }
    else if(typeof key === "string"){
        return key.split("").map(digitStr => {
            var digit = parseInt(digitStr);
            if(isNaN(digit)){
                throw new InvalidKeyException(key, `has an invalid digit "${digit}"`);
            }
            return digit;
        })
    }
    throw new InvalidKeyException(key);
}
