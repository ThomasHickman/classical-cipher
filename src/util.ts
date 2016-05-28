import _ = require("lodash")

export var lowercaseLetters = "abcdefghijklmnopqrstuvwxyz";
export var uppercaseLetters = lowercaseLetters.toUpperCase();

export var toLetterCode = (letter: string) => letter.charCodeAt(0) - 65;
export var fromLetterCode = (num: number) => String.fromCharCode(num + 65);

export function factorial(num: number){
    var result = 0;
    for(var i = 1;i<=num;i++){
        result *= i;
    }
    return result;
}

export class Exception extends Error {
    constructor(public message: string) {
        super(message);
        this.name = 'Exception';
        this.stack = (<any>new Error()).stack;
    }
    toString() {
        return this.name + ': ' + this.message;
    }
}

export class NotImplementedException extends Exception {
    name = "NotImplementedException"
    constructor(str = "Function not implemented"){
        super(str)
    }
}

export function generateUniformArray<type>(elementToRepeat: type, times: number, deep = false) {
    var retValue = <type[]>[];
    for (var i = 0; i < times; i++) {
        retValue.push(deep ? <type>_.cloneDeep(elementToRepeat) : elementToRepeat);
    }
    return retValue;
}

export function random_element<type>(arr: type[]){
    return arr[_.random(0, arr.length - 1)]
}

export type Appendable = Array<any> | string;

export function append<T>(arr: T[], element: T): T[];
export function append(arr: string, element: string): string;
export function append<T>(arr: T[] | string, element: any): T[] | string{
    if(typeof arr === "string"){
        arr += element;
        return arr;
    }
    else if(typeof arr === "object"){
        arr.push(element);
        return arr;
    }
}

export function unformat(text: string){
    var output = "";
    for (var i = 0; i < text.length; i++) {
        var charCode = text[i].charCodeAt(0);
        if (charCode >= 97 /*a*/ && charCode <= 122 /*z*/) {
            output += String.fromCharCode(charCode - 32);
        }
        else if (charCode >= 65 /*A*/ && charCode <= 90 /*Z*/) {
            output += text[i];
        }
    }
    return output;
}

export function format(text: string, original: string){
    function testInvarient(){
        if(text[inputNumOn] === undefined){
            throw new Error(`[Cipher.format] the text "${text}" cannot be matched formatted with
                original "${original}"`)
        }
    }
    var output = "";
    var inputNumOn = 0;
    for (var i = 0; i < original.length; i++) {
        var charCode = original[i].charCodeAt(0);
        if (charCode >= 97 /*a*/ && charCode <= 122 /*z*/) {
            testInvarient()
            output += text[inputNumOn++].toLowerCase();
        }
        else if (charCode >= 65 /*A*/ && charCode <= 90 /*Z*/) {
            testInvarient()
            output += text[inputNumOn++].toUpperCase();
        }
        else {
            output += original[i];
        }

    }
    return output;
}

export function _throw(value: any){
    throw value
}
