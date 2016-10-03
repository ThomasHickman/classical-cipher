export {Cipher} from "./Ciphers/Cipher"

import Amsco = require("./Ciphers/Amsco");
import CaesarShift = require("./Ciphers/CaesarShift");
import ColumnTransposition = require("./Ciphers/ColumnTransposition");
import HillCipher = require("./Ciphers/HillCipher");
import SimpleSubstitution = require("./Ciphers/SimpleSubstitution");
import Vigenere = require("./Ciphers/Vigenere");
import RailFence = require("./Ciphers/RailFence");

export var amsco = new Amsco();
export var caesarShift = new CaesarShift();
export var columnTransposition = new ColumnTransposition();
export var hillCipher = new HillCipher();
export var simpleSubstitution = new SimpleSubstitution();
export var vigenere = new Vigenere();
export var railFence = new RailFence();

export import cipherUtil = require("./Ciphers/cipherUtil")
