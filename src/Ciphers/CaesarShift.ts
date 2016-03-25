import {Cipher} from "./Cipher"
import keys = require("../keys");
import {
    letterCodeMap,
    cMod
} from "./HelperFunctions"

import {

} from "./../util"

import _ = require("lodash")

class CaesarShift extends Cipher<number>{
    name = "Caesar Shift";
    keyInfo = new keys.Integer(0, 25);
    rawEncrypt(input: string, key: number){
        return letterCodeMap(input, (inp: number) => cMod((inp + key), 26))
    }
    rawDecrypt(input: string, key: number){
        return letterCodeMap(input, (inp: number) => cMod((inp - key), 26))
    }
}

export = CaesarShift
