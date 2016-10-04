export {Solver} from "./Solvers/Solver";

import BruteForce from "./Solvers/BruteForce"
import HillClimbing from "./Solvers/HillClimbing"
import SimmulatedAnnealing from "./Solvers/SimmulatedAnnealing";

export var bruteForce = new BruteForce();
export var hillClimbing = new HillClimbing();
export var simmulatedAnnealing = new SimmulatedAnnealing();
