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

export function generateUniformArray<type>(elementToRepeat: type, times: number, deep = false) {
    var retValue = <type[]>[];
    for (var i = 0; i < times; i++) {
        retValue.push(deep ? <type>_.cloneDeep(elementToRepeat) : elementToRepeat);
    }
    return retValue;
}
