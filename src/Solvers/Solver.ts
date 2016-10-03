import Cipher from "../Ciphers/Cipher"
import Stat = require("../Stats/Stat")
import Reporter = require("../Reporters/Reporter")
import cc = require("../index")
import _ = require("lodash")
import util = require("../util")

/*
export interface SolverSettings {
    useLowestValue?: boolean;
    initKey?: any;
    needToPassBenchmark?: boolean
    iterations?: number;
    outerIterations?: number;
    keyLength?: number;
    testingLimit: number;
}*/

export interface DefaultSolverParameters<CipherKey, SolverSettings>{
    cipher?: Cipher<CipherKey>;
    stat?: Stat;
    solver?: Solver<CipherKey, SolverSettings>;
    reporter?: Reporter;
    settings?: SolverSettings & {
        formatResult: boolean
    };
}

export interface SolverParameters<CipherKey, SolverSettings> extends DefaultSolverParameters<CipherKey, SolverSettings>{
    cipherText: string;
}

export interface SolverReturn<T> {
    text: string,
    key: T
}

var neededSolverParameters = [
    "cipherText",
    "cipher",
    "stat",
    "solver",
    "reporter"
]

var defaultSolverParams = {
    reporter: cc.reporters.stdout,
    settings: {
        formatResult: false
    }
}

export function solve<keyType>(parameters: SolverParameters<keyType, any>){
    if(parameters.cipher == undefined){
        throw new Error("Cannot solve ciphertext with no specified cipher");
    }
    _.defaultsDeep(parameters,
        _.cloneDeep(parameters.cipher.defaultSolverParameters),
        _.cloneDeep(defaultSolverParams));

    neededSolverParameters.forEach(param => {
        if(parameters[param] == undefined){
            throw new Error(`Solver cannot infer and has not been passsed parameter "${parameters[param]}"`);
        }
    })

    var rawSolve = parameters.solver.rawSolve(parameters);

    if(parameters.settings.formatResult){
        return rawSolve;
    }

    return <SolverReturn<keyType>>{
        text: util.format(rawSolve.text, parameters.cipherText),
        key: rawSolve.key
    }
}

export abstract class Solver<T, SettingsObject> {
    static allSolvers = [];
    name: string;
    abstract rawSolve<T>(args: SolverParameters<T, SettingsObject>): SolverReturn<T>;

    solve<T>(args: SolverParameters<T, SettingsObject>){
        if (args.cipherText == "")
            throw Error("Cannot solve a plaintext of length 0");
        args.solver = this;
        return solve(args);
    }

    constructor() {
        Solver.allSolvers.push(this);
    }
}

export default Solver;
