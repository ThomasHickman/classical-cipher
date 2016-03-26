import {Cipher} from "./Cipher"
import keys = require("../keys");
import {
    inversePermutation
} from "./HelperFunctions"

import {

} from "./../util"

import _ = require("lodash")

class ColumnarTransposition extends Cipher<number[]>{
    name = "Columnar Transposition";
    keyInfo = new keys.NumericArrangement();
    rawEncrypt(input: string, key: number[]) {
        var paddedText = input;
        if (input.length % key.length != 0) {
            for (var i = 0; i < key.length - (input.length % key.length); i++) {
                paddedText += "X";
            }
        }
        return inversePermutation(key).map(num => {
            var column = "";
            for (var i = num; i < paddedText.length; i += key.length) {
                column += paddedText[i];
            }
            return column
        }).join("")
    }
    rawDecrypt(input: string, key: number[]) {
        if (input.length % key.length != 0) {
            var inputLen = input.length;
            for (var i = 0; i < key.length - (inputLen % key.length); i++) {
                input += "X";
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
