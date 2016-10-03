import {
    Solver,
    SolverParameters
} from "../Solvers/Solver"

import {
    NotImplementedException
} from "../util"

import _ = require("lodash");

function hill_climbing<T>(init: T, progress: (value: T) => T, weight: (value: T) => number){
    var curr_value = _.cloneDeep(init);
}

export interface Settings<T> {
    initKey: T;
}

export default class HillClimbing<T> extends Solver<T, Settings<T>>{
    name = "Hill Climbing";
    rawSolve(args: SolverParameters<T, Settings<T>>){
        _.defaults(args.settings, {
            needToPassBenchmark: true,
            initKey: args.cipher.keyInfo.generateRandom(),
            iterations: 1000
        });

        var bestKey = args.settings.initKey;
        var bestWeight = args.stat.lowerIsBetter?Infinity:-Infinity;
        for(var tryNum = 0;tryNum < 10000;tryNum++){
            var currKey = args.cipher.keyInfo.smallAlteration(bestKey);
            var decryptedText = args.cipher.decrypt(args.cipherText, currKey);
            var keyWeight = args.stat.findStatistic(decryptedText);

            if(args.stat.lowerIsBetter == keyWeight < bestWeight){
                bestWeight = keyWeight;
                bestKey = currKey;
                args.reporter.log(`Found new key: ${currKey} text ${decryptedText.slice(0, 100)}, of weight ${keyWeight}`);
            }
        }

        return {
            text: args.cipher.decrypt(args.cipherText, bestKey),
            key: bestKey
        }
    }
}
