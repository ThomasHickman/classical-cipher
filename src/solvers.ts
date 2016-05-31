export {Solver} from "./Solvers/Solver";

import BruteForce = require("./Solvers/BruteForce")
import HillClimbing = require("./Solvers/HillClimbing")
import SimmulatedAnnealing = require("./Solvers/SimmulatedAnnealing");

export var bruteForce = new BruteForce();
export var hillClimbing = new HillClimbing();
export var simmulatedAnnealing = new SimmulatedAnnealing();
