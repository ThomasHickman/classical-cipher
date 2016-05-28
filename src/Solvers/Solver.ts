import Cipher from "../Ciphers/Cipher"
import Stat = require("../Stats/Stat")
import Reporter = require("../Reporters/Reporter")
import cc = require("../index")
import _ = require("lodash")
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

export interface SolverParameters<T>{
    cipherText: string;
    cipher?: Cipher<T>;
    stat?: Stat;
    solver?: Solver<T>;
    reporter?: Reporter;
    settings?: any;
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
    settings: {}
}

export function solve<T>(parameters: SolverParameters<T>){
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

    return parameters.solver.rawSolve(parameters);
}

export abstract class Solver<T> {
    static allSolvers = [];
    name: string;
    abstract rawSolve<T>(args: SolverParameters<T>): SolverReturn<T>;

    solve<T>(args: SolverParameters<T>){
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
