import {Cipher} from "./Cipher"
import keys = require("../keys");
import {
    letterCodeMap,
    cMod
} from "./cipherUtil"

import {
    uppercaseLetters,
    toLetterCode
} from "./../util"

import _ = require("lodash")

class Vigenere extends Cipher<string[]>{
    name = "Vigenère";
    keyInfo = new keys.FixedArrangement(uppercaseLetters.split(""))
    rawDecrypt(input: string, key: string[]){
        return letterCodeMap(input, (letter, n) => cMod(letter - toLetterCode(key[(n % key.length)]), 26))
    };
    rawEncrypt(input: string, key: string[]){
        return letterCodeMap(input, (letter, n) => cMod(letter + toLetterCode(key[(n % key.length)]), 26))
    }
}

export = Vigenere
