import keys = require("../keys")
import _ = require("lodash");

export interface EncyptionOptions{
    formatResult?: boolean
}

var EncyptionOptionsDefault = {
    formatResult: true
}

interface solvedCipherInfo<keyType> {
    key: keyType;
    solution: string;
}

export abstract class Cipher<keyType>{
    static allCiphers = <Cipher<any>[]>[];
    static unformat(text: string){
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

    static format(text: string, original: string){
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

    constructor() {
        Cipher.allCiphers.push(this);
    }
    name: string;
    /** Encrypts without checking the key, converting the key or formatting the key*/
    abstract rawEncrypt(input: string, key: keyType): string;
    /** Encrypts without checking the key, converting the key or formatting the key*/
    abstract rawDecrypt(input: string, key: keyType): string;

    private formattedCipherOperation(input: string, key: keyType,
                                    options: EncyptionOptions,
                                    operation: (input: string, key: keyType) => string){
        _.defaults(options, EncyptionOptionsDefault) // Modifies options
        var decryptedText = operation(Cipher.unformat(input), this.keyInfo.getPrimitiveKey(key))
        return options.formatResult? Cipher.format(decryptedText, input) : decryptedText;
    }
    encrypt (input: string, key: any, options: EncyptionOptions = {}){
        return this.formattedCipherOperation(input, key, options, this.rawEncrypt.bind(this));
    }
    decrypt (input: string, key: any, options: EncyptionOptions = {}){
        return this.formattedCipherOperation(input, key, options, this.rawDecrypt.bind(this));
    }
    nonFormatting: {
        encrypt: (input: string, key: keyType) => string;
        decrypt: (input: string, key: keyType) => string;
    }
    recommendedSolveMethod: any;

    solve(x: void){
        return Error("Not implemented yet");
    };
    keyInfo: keys.Key<keyType>;
}

export default Cipher
