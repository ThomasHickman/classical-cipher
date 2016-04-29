import {
    Solver,
    SolverParameters
} from "../Solvers/Solver"

import {
    NotImplementedException
} from "../util"

import _ = require("lodash");
import cc = require("../index");



class HillClimbing<T> extends Solver<T>{
    name = "Hill Climbing";
    rawSolve(args: SolverParameters<T>){
        _.defaults(args.settings, {
            needToPassBenchmark: true,
            initKey: args.cipher.keyInfo.generateRandom(),
            outerIterations: 20,
            iterations: 1000,
            reducedCipherTextLength: args.cipherText.length
        });
        if(args.cipher.keyInfo.smallAlteration == undefined){
            throw new NotImplementedException("Small alteration function not implemeted!");
        }

        var referenceCipherText = args.cipherText.slice(0, args.settings.reducedCipherTextLength);
        var key: T;
        var highestResult;
        var decrypted: string;
        var result: number;
        var iterOn = 0;
        var newKey: T;
        var bestIteration = {
            result: args.stat.lowerIsBetter ? Infinity : -Infinity,
            key: <T>null,
        };
        for (var i = 0; i < args.settings.iterations; i++) {
            newKey = args.cipher.keyInfo.smallAlteration(key);
            decrypted = args.cipher.rawDecrypt(referenceCipherText, newKey);
            result = args.stat.findStatistic(decrypted);
            if (result < highestResult.result == args.stat.lowerIsBetter) {
                i = 0;
                iterOn++;
                key = _.cloneDeep(newKey);
                args.reporter.log("Found better key: " + key);
                args.reporter.log("Text: " + decrypted.slice(0, 100) + "...");
                highestResult.key = _.cloneDeep(key);
                highestResult.result = result;
            }
        }
        args.reporter.finish(args.cipher.rawDecrypt(args.cipherText, highestResult.key), highestResult.key, highestResult.result);
        if (!args.settings.needToPassBenchmark && !args.settings.useLowestValue) {
            bestIteration = highestResult;
            break;
        }
        else if (bestIteration.result > highestResult.result == args.stat.lowerIsBetter) {
            bestIteration = highestResult;
            if (args.settings.needToPassBenchmark && (bestIteration.result < args.stat.significanceLevel == args.stat.lowerIsBetter)) {
                return args.cipher.rawDecrypt(args.cipherText, bestIteration.key);
            }
        }
        key = args.cipher.keyInfo.startRnd();
        if (settings.needToPassBenchmark) {
            reporter.error("Cannot get highest result");
            reporter.finish(cipher.nonFormatting.decrypt(cipherText, bestIteration.key), bestIteration.key, tester.func(cipher.nonFormatting.decrypt(cipherText, bestIteration.key)));
        }
        return cipher.nonFormatting.decrypt(cipherText, bestIteration.key);
    }
}

export = HillClimbing;
