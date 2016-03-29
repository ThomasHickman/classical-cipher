import {Cipher} from "./Cipher"
import keys = require("../keys");
import {

} from "./cipherUtil"

import {
    NotImplementedException
} from "./../util"

import _ = require("lodash")

class Playfair extends Cipher<string[]>{
    name = "Playfair"
    keyInfo = new keys.FixedArrangement("ABCDEFGHIKLMNOPQRSTUVWXYZ".split(""))
    rawEncrypt(input: string, key: string[]): string {
        throw new NotImplementedException();
    }
    rawDecrypt(input: string, key: string[]) {
        var size = 5;
        function getSquareLetter(x, y) {
            var retvalue = key[(y - 1) + ((x - 1) * size)];
            if (retvalue == "_") {
                // Blank charater
                invaidlettergot = true;
                retvalue = "a";
            }
            return retvalue;
        }
        function getSquarePos(letter) {
            var pos = key.indexOf(letter);
            if (pos == -1) {
                invaidlettergot = true;
                pos = 0;
            }
            return [Math.floor((pos / size) + 1), (pos % size) + 1];
        }
        if (size == undefined)
            size = 5;
        var invaidlettergot = false;
        if (input.length % 2 != 0) {
            console.log("SolvePlayfair: code passed to function has an odd length");
            return "";
        }
        var finalst = "";
        for (var i = 0; i < input.length; i += 2) {
            var a = input[i];
            var b = input[i + 1];
            var sqposa = getSquarePos(a);
            var sqposb = getSquarePos(b);
            /*
             * if (a == b) { //Same letter //Replace second letter with x finalst +=
             * a + "X"; i -= 2; what = finalst; } else
             */if (sqposa[0] == sqposb[0]) {
                // Same row
                // Get letter below
                // 1st
                if (sqposa[1] == 1) {
                    // Wrap round
                    finalst += getSquareLetter(sqposa[0], size);
                } else {
                    finalst += getSquareLetter(sqposa[0], sqposa[1] - 1);
                }
                // 2nd
                if (sqposb[1] == 1) {
                    // Wrap round
                    finalst += getSquareLetter(sqposb[0], size);
                } else {
                    finalst += getSquareLetter(sqposb[0], sqposb[1] - 1);
                }
            } else if (sqposa[1] == sqposb[1]) {
                // Same column
                // Get letter across
                // 1st
                if (sqposa[0] == 1) {
                    // Wrap round
                    finalst += getSquareLetter(size, sqposa[1]);
                } else {
                    finalst += getSquareLetter(sqposa[0] - 1, sqposa[1]);
                }
                // 2nd
                if (sqposb[0] == 1) {
                    // Wrap round
                    finalst += getSquareLetter(size, sqposb[1]);
                } else {
                    finalst += getSquareLetter(sqposb[0] - 1, sqposb[1]);
                }
            } else {
                // No trend
                // Do rectangle
                // 1st
                finalst += getSquareLetter(sqposa[0], sqposb[1]);
                // 2nd
                finalst += getSquareLetter(sqposb[0], sqposa[1]);
            }
            // See if an invalid letter has been used and replace it with _
            if (invaidlettergot) {
                invaidlettergot = false;
                // Take off final 2 letters
                finalst = finalst.slice(0, finalst.length - 2);
                // Replace with blanks
                finalst += "_";
                finalst += "_";
            }
        }
        return finalst;
    }
}

export = Playfair
