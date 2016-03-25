import cc = require("../dist/index")
import assert = require("assert")
import _ = require("lodash")

describe("abstract ciphers", () => {
    it("formats and unformats strings", () => {
        assert(cc.ciphers.Cipher.unformat("Test string!"), "TESTSTRING")
        assert(cc.ciphers.Cipher.format("TSTSSTRNGY", "Test string!"), "Tsts strngy!")
    })
});

describe("Cipher", () => {
    var notFinishedCiphers = [
        "Playfair"
    ]
    var testString = "this is a test string";
    cc.ciphers.Cipher.allCiphers.forEach(cipher => {
        describe(cipher.name, () => {
            var testingFunc = _.includes(notFinishedCiphers, cipher.name)? xit : it
            testingFunc("decryption of encryption should be a no-op", () => {
                var randomKey = cipher.keyInfo.generateRandom();
                assert.equal(cipher.decrypt(
                    cipher.encrypt(testString, randomKey), randomKey), testString);
            });
        });
    })
});
