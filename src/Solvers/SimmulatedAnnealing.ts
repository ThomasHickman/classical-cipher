import {
    Solver,
    SolverParameters
} from "../Solvers/Solver"

import {
    NotImplementedException
} from "../util"

import _ = require("lodash");
import cc = require("../index");

class SimmulatedAnnealing<T> extends Solver<T>{
    name = "Simmulated Annealing";

    private P(oldWeight: number, newWeight: number, temp: number, lowerIsBetter: boolean){
        if(newWeight < oldWeight == lowerIsBetter)
            return 1;
        return Math.exp(-Math.abs(oldWeight - newWeight)/temp);
    }

    private getTemp(completed: number){
        return completed;
    }

    rawSolve(args: SolverParameters<T>){
        _.defaults(args.settings, {
            initKey: args.cipher.keyInfo.generateRandom(),
            iterations: 1000
        });
        const coolingRate = 0.03;
        var temp = 10000

        var lowerIsBetter = args.stat.lowerIsBetter;

        var currKey = args.settings.initKey;
        var currText = args.cipher.decrypt(args.cipherText, currKey);
        var currWeight = args.stat.findStatistic(currText);
        while(temp > 1){
            var newKey = args.cipher.keyInfo.smallAlteration(currKey);
            var newText = args.cipher.decrypt(args.cipherText, newKey);
            var newWeight = args.stat.findStatistic(newText);

            if(this.P(currWeight, newWeight, temp, lowerIsBetter) >= Math.random()){
                console.log(currWeight, newWeight, temp, this.P(currWeight, newWeight, temp, lowerIsBetter));
                currKey = newKey;
                currText = newText;
                currWeight = newWeight;
                args.reporter.log(`Using new key: ${currKey} text ${currText.slice(0, 100)}, of weight ${currWeight}`)
            }

            temp *= 1-coolingRate;
        }

        return {
            text: currText,
            key: currKey
        }
    }
}

export = SimmulatedAnnealing;
