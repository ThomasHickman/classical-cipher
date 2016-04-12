export import Reporter = require("./Reporters/Reporter")

import Stdout = require("./Reporters/Stdout");
import SilentReporter = require("./Reporters/SilentReporter");

export var stdout = new Stdout();
export var silentReporter = new SilentReporter();
