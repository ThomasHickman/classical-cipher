import {Cipher} from "./Cipher"
import keys = require("../keys");
import {
    transpose,
    undoPermutation,
    applyPermutation,
    divideBy
} from "./HelperFunctions"

import {
    generateUniformArray
} from "./../util"

import _ = require("lodash")

class Amsco extends Cipher<number[]>{
    name = "Amsco";
    keyInfo = new keys.Arrangement(keyLength => _.range(0, keyLength - 1));
    private getAmscoBoxes(str: string, startOdd: boolean){
        if(startOdd){
            return [str[0]].concat(this.getAmscoBoxes(str.slice(1), false))
        }
        return _.chain(str.split(""))
            .chunk(3)
            .map(arr => _.chunk(arr, 2).map(x => x.join("")))
            .flatten()
            .value()
    }

    private getAmscoColumnsFromPlaintext(input: string, keyLength: number){
        return <string[][]>transpose(
                _.chain(input.split(""))
                .chunk(3)
                .map(arr => _.chunk(arr, 2).map(x => x.join("")))
                .flatten()
                .chunk(keyLength)
                .value())
    }

    private getAmscoColumnsFromCiphertext(input: string, key: number[]){
        var columnLengthsByCiphertextOrder = this.findAmscoColumnLengths(input.length, key.length);
        var reverseKey = undoPermutation(_.range(0, key.length), key)
        var columnLengthsByPlaintextOrder = undoPermutation(columnLengthsByCiphertextOrder, key)
        var nonBoxedColumns = divideBy(input, columnLengthsByPlaintextOrder)
        return nonBoxedColumns.map((x, i) => this.getAmscoBoxes(x, reverseKey[i] % 2 == 1));
    }

    private findAmscoColumnLengths(inputLength: number, keyLength: number) {
        var columnLengths = generateUniformArray(0, keyLength);
        var boxPosition = 0;
        for (var stringPosition = 0; stringPosition < inputLength; boxPosition++) {
            if (boxPosition % 2 == 1) {
                stringPosition++;
                columnLengths[boxPosition % keyLength]++;
            }
            else {
                if(stringPosition + 2 <= inputLength){
                    stringPosition += 2;
                    columnLengths[boxPosition % keyLength] += 2;
                }
                else{
                    stringPosition++;
                    columnLengths[boxPosition % keyLength]++;
                }
            }
        }
        return columnLengths;
    }

    rawDecrypt(input: string, key: number[]) {
        return _.flatten(transpose(applyPermutation(this.getAmscoColumnsFromCiphertext(input, key), key))).join("");
    }
    rawEncrypt(input: string, key: number[]){
        return _.flatten(undoPermutation(this.getAmscoColumnsFromPlaintext(input, key.length), key)).join("")
    }
}

export = Amsco
