import cc = require("../dist/index")
import assert = require("assert")
import _ = require("lodash")

describe("abstract ciphers", () => {
    it("formats and unformats strings", () => {
        assert(cc.ciphers.Cipher.unformat("Test string!"), "TESTSTRING")
        assert(cc.ciphers.Cipher.format("TSTSSTRNGY", "Test string!"), "Tsts strngy!")
    })
});

describe("test decrypt", () => {
    it("amsco", () => {
        assert.equal(
            cc.ciphers.amsco.decrypt("RIHFTUANMRFUHGAC", [3,5,1,2,4]),
            "ANGRIFFUMACHTUHR")
    });
})

describe("test encrypt", () => {
    it("amsco", () => {
        assert.equal(
            cc.ciphers.amsco.encrypt("ANGRIFFUMACHTUHR", [3,5,1,2,4]),
            "RIHFTUANMRFUHGAC")

        assert.equal(
            cc.ciphers.amsco.encrypt("RIDERSONTHESTORMINTOTHISHOUSEWEAREBORNJIMMORRISON", [7,4,5,6,3,2,1]),
            "HETEAMTTOWIMONNSEJNDTOSEBRERRHOOISSMIURNORISHIROR")
    })
    it("columnar transposition", () => {
        assert.equal(
            cc.ciphers.columnTransposition.encrypt("WE ARE DISCOVERED. FLEE AT ONCE",
            [6,3,2,4,1,5],
            {formatResult: false}
        ), "EVLNXACDTXESEAXROFOXDEECXWIREE");
        //https://en.wikipedia.org/wiki/Transposition_cipher#Columnar_transposition, using Xs
    })
})

describe("self-tests:", () => {
    var testString = "this is a test";
    var notFinishedCiphers = [
        "Playfair"
    ];
    var randomParameters = {
        "ColumnTransposition": [cc.ciphers.Cipher.unformat(testString).length * _.random(1, 10)]
    }
    cc.ciphers.Cipher.allCiphers.forEach(cipher => {
        describe(cipher.name, () => {
            var testingFunc = _.includes(notFinishedCiphers, cipher.name)? xit : it
            testingFunc("decryption of encryption should be a no-op", () => {
                var randomKey = cipher.keyInfo.generateRandom.call(cipher.keyInfo, randomParameters[cipher.name]);
                assert.equal(cipher.decrypt(
                    cipher.encrypt(testString, randomKey), randomKey), testString);
            });
        });
    })
});
