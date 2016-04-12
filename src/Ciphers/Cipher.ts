import keys = require("../keys")
import _ = require("lodash");
import Stat = require("../Stats/Stat")

import {
    Solver
} from "../Solvers/Solver"

import {
    format,
    unformat
} from "../util"

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

export interface DefaultSolverParameters<T>{
    stat?: Stat;
    solver?: Solver<T>;
}

export abstract class Cipher<keyType>{
    static allCiphers = <Cipher<any>[]>[];

    constructor() {
        Cipher.allCiphers.push(this);
    }
    name: string;
    /** Encrypts without checking the key, converting the key or formatting the key*/
    abstract rawEncrypt(input: string, key: keyType): string;
    /** Encrypts without checking the key, converting the key or formatting the key*/
    abstract rawDecrypt(input: string, key: keyType): string;

    /***/
    defaultSolverParameters: DefaultSolverParameters<keyType>;

    private formattedCipherOperation(input: string, key: keyType,
                                    options: EncyptionOptions,
                                    operation: (input: string, key: keyType) => string){
        _.defaults(options, EncyptionOptionsDefault) // Modifies options
        var decryptedText = operation(unformat(input), this.keyInfo.getPrimitiveKey(key))
        return options.formatResult? format(decryptedText, input) : decryptedText;
    }
    encrypt (input: string, key: any, options: EncyptionOptions = {}){
        return this.formattedCipherOperation(input, key, options, this.rawEncrypt.bind(this));
    }
    decrypt (input: string, key: any, options: EncyptionOptions = {}){
        return this.formattedCipherOperation(input, key, options, this.rawDecrypt.bind(this));
    }
    /*nonFormatting: {
        encrypt: (input: string, key: keyType) => string;
        decrypt: (input: string, key: keyType) => string;
    }*/
    recommendedSolveMethod: any;

    solve(x: void){
        return Error("Not implemented yet");
    };
    keyInfo: keys.Key<keyType>;
}

export default Cipher
