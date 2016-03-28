import {Cipher} from "./Cipher"
import keys = require("../keys");
import {

} from "./cipherUtil"

import {
    NotImplementedException
} from "./../util"

import _ = require("lodash")

class RailFence extends Cipher<number> {
    name = "Rail Fence";
    keyInfo = new keys.Integer(2);
    rawEncrypt(input: string, key: number) {
        var areIncreasingLevels = true; // Whether the thing is going down or up
        var levelIndex = 0; //Where you are horizontally
        var levels = []; //The collection of levels
        for (var i = 0; i < input.length; i++) {
            if (levels[levelIndex] == undefined) {
                levels[levelIndex] = [];
            }
            levels[levelIndex].push(input[i]);
            if (areIncreasingLevels)
                levelIndex++;
            else
                levelIndex--;

            if (levelIndex == key - 1)
                areIncreasingLevels = false;
            if (levelIndex == 0)
                areIncreasingLevels = true;
        }
        var retValue = "";
        for (var i = 0; i < key; i++) {
            retValue += levels[i].join("");
        }
        return retValue;
    }
    rawDecrypt(input: string, key: number) {
        var position;
        var plainText = [];
        //Beginning
        var i = 0;
        for (var row = 0; row < key; row++) {
            position = row;
            while (position < input.length) {
                plainText[position] = input[i];
                if (row == 0 || row == key - 1 || position + (key - row - 1) * 2 >= input.length)
                    i++;
                else {
                    plainText[position + (key - row - 1) * 2] = input[i + 1];
                    i += 2;
                }
                position += key * 2 - 2;
            }
        }
        return plainText.join("");
    }
}

export = RailFence
