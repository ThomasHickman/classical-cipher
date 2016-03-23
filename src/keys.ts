import _ = require("lodash")
import {
    Exception,
    generateUniformArray,
    factorial
    } from "./common"

module Keys {
    interface Indexable{
        length: number;
        [index: number]: any;
    }
    export class InvalidKeyException extends Exception{
        constructor(invalidKey: any, message?: string){
            super(`${invalidKey} is an invalid key${message == undefined?"" : `, it ${message}`}`)
        }
    }
    export interface KeyType<internalKeyType> {
        startGeneration(): internalKeyType;
        /** generates the logical next key, or if the next key is at the top, null*/
        generateOrdered(previous?: internalKeyType): internalKeyType;
        /**Sees if the input is a valid key, if it is convert it to the required
          * primitive value, if it isn't throws an Error*/
        getPrimitiveKey(value: any): internalKeyType;
        /**Generates a random key */
        generateRandom: (...args) => internalKeyType;
        range: number;
        conversions?: {
            typeFrom: string;
            convert: (from: any) => internalKeyType
        }[];
        changeParameters?: Function;
        fixedLength?: number;
    }
    export class Integer implements KeyType<number>{
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

            if(potentialValue > this.min && potentialValue < this.max){
                return potentialValue;
            }
            else{
                throw new InvalidKeyException(inputKey, "is out of the keys range");
            }
        }

        generateRandom(){
            return _.random(this.min, this.max)
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

    function testKeyType(key: any, expectedType: "number" | "string" | "object" | "array" | Function){
        if(expectedType == "array"){
            if(_.isArray(key)){
                throw new InvalidKeyException(key, "is not an array")
            }
        }
        else if(typeof expectedType === "object"){
            if(key instanceof expectedType){

            }
        }
    }

    export class NonUniqueArray<type> implements KeyType<type[]> {
        constructor(protected alphabet: type[], protected keyLength: number){}

        get range(){
            return Math.pow(this.alphabet.length, this.keyLength);
        }

        getPrimitiveKey(key: any){
            if(_.isArray(key)){
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
                rndStr.push(this.alphabet[_.random(this.alphabet.length)]);
            }
            return rndStr;
        }
    }

    export class NonUniqueString implements KeyType<string> {
        constructor(protected alphabet: string, protected keyLength: number){}

        get range(){
            return Math.pow(this.alphabet.length, this.keyLength);
        }

        getPrimitiveKey(key: string){
            if(typeof key === "string"){
                return key
            }
            else{
                throw new InvalidKeyException(key, " it is not a string");
            }
        }

        generateOrdered(previous: string){
            var newArr = previous;
            var i = 0;
            for(var i = 0;i<newArr.length;i++){
                var letterIndex = this.alphabet.indexOf(newArr[i]);
                if (letterIndex < this.alphabet.length - 1) {
                    newArr += this.alphabet[letterIndex + 1];
                    break;
                }
                else {
                    newArr += this.alphabet[0];
                    i++;
                }
            }
            return newArr;
        }

        startGeneration() {
            return _.repeat(this.alphabet[0], this.keyLength);
        }

        generateRandom() {
            var rndStr = "";
            for (var i = 0; i < this.keyLength; i++) {
                rndStr += this.alphabet[_.random(this.alphabet.length)];
            }
            return rndStr;
        }
    }


    function orderedArray(upTo: number) {
        var retValue = <number[]>[];
        for (var i = 0; i < upTo; i++) {
            retValue.push(i + 1);
        }
        return retValue;
    }

    function nextPermutation<t>(array: t[]) {
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

    export class FixedArrangement<type> implements KeyType<type[]>{
        constructor(private alphabet: type[]) {
        }

        startGeneration() {
            return this.alphabet;
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

    export class Arrangement<type> implements KeyType<type[]>{
        startGeneration() {
            return [this.elementKeyType.startGeneration()];
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

        generateRandom(keyLength: number) {
            var rndArr = new Array(keyLength);
            _.times(keyLength, i => {
                rndArr[i] = this.elementKeyType.generateRandom();
            })
            return rndArr;
        }

        generateOrdered(previous = this.startGeneration()) {
            return nextPermutation(previous);
        }

        constructor(private elementKeyType: KeyType<type>){
        }
    }

    function testNumericArrangementOfNumbers(key: number[] | string){
        if(_.isArray(key) && key.every(el => typeof el == "number")){
            return key;
        }
        else if(typeof key === "string"){
            return key.split("").map(digitStr => {
                var digit = parseInt(digitStr);
                if(isNaN(digit)){
                    throw new InvalidKeyException(key);
                }
                return digit;
            })
        }
        throw new InvalidKeyException(key);
    }

    export class FixedArrangementOfNumbers extends FixedArrangement<number> implements KeyType<number[]>{
        constructor(from: number, to: number){
            super(_.range(from, to))
        }

        getPrimitiveKey(key: number[] | string){
            return testNumericArrangementOfNumbers(key);
        }
    }
}

export = Keys
