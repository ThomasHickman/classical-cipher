import {Cipher} from "./Cipher"
import keys = require("../keys");
import {

} from "./HelperFunctions"

import {

} from "./../util"

import _ = require("lodash")

class ColumnarTransposition extends Cipher<number[]>{
    name = "Columnar Transposition";
    keyInfo = new keys.FixedArrangement(_.range(1, 10))
    rawEncrypt(input: string, key: number[]) {
        if (input.length % key.length != 0) {
            var inputLen = input.length;
            for (var i = 0; i < key.length - (inputLen % key.length); i++) {
                input += "x";
            }
        }
        var coloums = <Array<string>>[];
        key.forEach((el) => {
            coloums[el] = "";
            for (var o = el; o < input.length; o += key.length) {
                coloums[el] += input[o];
            }
        });
        return coloums.join("");
    }
    rawDecrypt(input: string, key: number[]) {
        if (input.length % key.length != 0) {
            var inputLen = input.length;
            for (var i = 0; i < key.length - (inputLen % key.length); i++) {
                input += "x";
            }
        }
        var newGridLength = input.length / key.length;
        var newStr = "";
        key.forEach((el) => {
            newStr += input.substr(el * newGridLength, newGridLength);
        });
        var coloums = <Array<string>>[];
        for (var i = 0; i < newGridLength; i++) {
            coloums[i] = "";
            for (var o = i; o < newStr.length; o += newGridLength) {
                coloums[i] += newStr[o];
            }
        };
        return coloums.join("");
    }
}

export = ColumnarTransposition
