import {
    Solver,
    SolverParameters
} from "../Solvers/Solver"
import _ = require("lodash");
import cc = require("../index")

class BruteForce<T> extends Solver<T>{
    name = "Brute Force";
    rawSolve(args: SolverParameters<T>){
        _.defaults(args.settings, {
            needToPassBenchmark: true,
            initKey: args.cipher.keyInfo.startGeneration(),
        })

        var currentKey = args.settings.initKey;
        var lowestRating = 0;
        var lowestKey: any;
        var rawCipherText = cc.util.unformat(args.cipherText)

        args.reporter.start(args.cipher.keyInfo.range);
        for (var i = 0; i < args.cipher.keyInfo.range; i++) {
            if (i != 0) {
                currentKey = args.cipher.keyInfo.generateOrdered(currentKey);
            }
            var newCipherText = args.cipher.rawDecrypt(rawCipherText, currentKey);
            var rating = args.stat.findStatistic(newCipherText);
            args.reporter.log("Current Key: " + currentKey + ", decrypting to " + newCipherText + ", rating: " + rating);
            if (i % 300 == 1)
                args.reporter.update(i);
            if ((rating < lowestRating == args.stat.lowerIsBetter) || lowestRating == 0) {
                lowestRating = rating;
                lowestKey = _.cloneDeep(currentKey);
            }
            if(!args.settings.useLowestValue) {
                if (rating < args.stat.significanceLevel == args.stat.lowerIsBetter) {
                    args.reporter.finish(newCipherText, currentKey, rating);
                    return {
                        text: newCipherText,
                        key: currentKey
                    };
                }
            }
        }
        if (!args.settings.useLowestValue) {
            args.reporter.error("No value was found to have the correct statistics");
        }
        args.reporter.finish(args.cipher.rawDecrypt(args.cipherText, lowestKey), lowestKey, lowestRating);
        return {
            text: args.cipher.rawDecrypt(args.cipherText, lowestKey),
            key: lowestKey
        }
    }
}

export = BruteForce
