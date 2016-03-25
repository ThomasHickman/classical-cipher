import {Cipher} from "./Cipher"
import keys = require("../keys");
import {
    letterCodeInputMap,
    letterCodeOutputMap
} from "./HelperFunctions"

import {
    uppercaseLetters
} from "./../util"

import _ = require("lodash")

class SimpleSubstitution extends Cipher<string[]>{
    name = "Simple Substitution";
    keyInfo = new keys.FixedArrangement(uppercaseLetters.split(""))
    rawEncrypt (input: string, key: string[]){
        return letterCodeInputMap(input, (el) => key[el])
    }
    rawDecrypt (input: string, key: string[]){
        return letterCodeOutputMap(input, (el) => key.join("").search(el))
    }
}

export = SimpleSubstitution
