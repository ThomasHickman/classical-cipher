import {Cipher} from "./Cipher"
import keys = require("../keys");
import {
    transpose,
    undoPermutation,
    applyPermutation
} from "./HelperFunctions"

import {

} from "./../util"

import _ = require("lodash")

class Amsco extends Cipher<number[]>{
    name = "Amsco";
    keyInfo = new keys.Arrangement(keyLength => _.range(0, keyLength - 1));
    private getAmscoColumns(input: string, keyLength: number){
        return <string[][]>transpose(
                _.chain(input.split(""))
                .chunk(3)
                .map(arr => _.chunk(arr, 2).map(x => x.join("")))
                .flatten()
                .chunk(keyLength)
                .value())
    }
    rawDecrypt(input: string, key: number[]) {
        return _.flatten(transpose(undoPermutation(this.getAmscoColumns(input, key.length), key))).join("")
    }
    rawEncrypt(input: string, key: number[]){
        return _.flatten(transpose(applyPermutation(this.getAmscoColumns(input, key.length), key))).join("")
    }
}

export = Amsco
