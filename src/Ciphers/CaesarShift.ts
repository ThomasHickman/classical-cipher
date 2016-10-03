import {Cipher} from "./Cipher"
import keys = require("../keys");
import ChiSquared = require("../Stats/ChiSquared")
import BruteForce from "../Solvers/BruteForce"

import {
    letterCodeMap,
    cMod
} from "./cipherUtil"

import {

} from "./../util"

class CaesarShift extends Cipher<number> implements Cipher<number>{
    name = "Caesar Shift";
    keyInfo = new keys.Integer(0, 25);
    rawEncrypt(input: string, key: number){
        return letterCodeMap(input, (inp: number) => cMod((inp + key), 26))
    }
    rawDecrypt(input: string, key: number){
        return letterCodeMap(input, (inp: number) => cMod((inp - key), 26))
    }
    defaultSolverParameters: {
        stat: ChiSquared,
        solver: BruteForce<any>
    }
}

export = CaesarShift
