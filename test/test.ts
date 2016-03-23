import assert = require("assert");
import ciphers = require("./../src/Ciphers/AllCiphers")
import {Cipher} from "./../src/Cipher";
ciphers;

require("./../src/Ciphers/AllCiphers")

describe("abstract ciphers", () => {
    it("formats and unformats strings", () => {
        assert(Cipher.unformat("Test string!"), "TESTSTRING")
        assert(Cipher.format("TSTSSTRNGY", "Test string!"), "Tsts strngy!")
    })
});

describe("Cipher", () => {
    var testString = "this is a test string";
    Cipher.allCiphers.forEach(cipher => {
        describe(cipher.name, () => {
            it("decryption of encryption should be a no-op", () => {
                var randomKey = cipher.keyInfo.generateRandom();
                assert.equal(cipher.decrypt(
                    cipher.encrypt(testString, randomKey), randomKey), testString);
            });
        });
    })
});
