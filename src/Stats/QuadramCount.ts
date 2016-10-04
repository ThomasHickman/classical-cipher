import {
    RealLetterProb,
    countLetterOccurences
} from "./statUtil"

import {
    uppercaseLetters
} from "../util"

import Stat = require("./Stat")

var quadrams = [];

class QuadramCount extends Stat{
    name = "Quadram Count";
    significanceLevel = 100;
    rawFindStatistic(text: string) {
        var result = 0;
        text = text.toUpperCase();
        var length = text.match(/[A-Z]/gi).length;
        for (var i = 0; i < uppercaseLetters.length; i++) {
            result += Math.pow(countLetterOccurences(uppercaseLetters[i], text)
                - (RealLetterProb[i] / 100) * length, 2) / ((RealLetterProb[i] / 100) * length);
        }
        return result;
    }
}

export = QuadramCount
