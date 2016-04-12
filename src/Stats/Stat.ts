import {
    unformat
} from "../util"

abstract class Stat {
    static allStats = <Stat[]>[];
    name: string;
    abstract rawFindStatistic(cipherText: string): number;
    significanceLevel: number;
    lowerIsBetter = true;

    findStatistic(cipherText: string){
        return this.rawFindStatistic(unformat(cipherText));
    }

    constructor() {
        Stat.allStats.push(this);
    }
}

export = Stat;
