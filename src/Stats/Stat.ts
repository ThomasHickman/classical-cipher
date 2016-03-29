import {
    unformat
} from "../util"

abstract class Stat<type> {
    static allStats = <Stat<any>[]>[];
    abstract name: string;
    abstract rawFindStatistic(cipherText: string): type;

    findStatistic(cipherText: string){
        return this.rawFindStatistic(unformat(cipherText));
    }

    constructor() {
        Stat.allStats.push(this);
    }
}

export = Stat;
