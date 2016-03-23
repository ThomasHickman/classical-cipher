import assert = require("assert");
import ciphers = require("./../src/Ciphers/AllCiphers")

describe("ciphers", function() {
    describe("amsco cipher", function() {
        it("should encrypt properly", () => {
            /*assert.equal(ciphers.amsco.encrypt("ANGRIFFUMACHTUHR", "35124")
                ,"RIHFTUANMRFUHGAC")*/
            console.log("hi")
            assert.equal(ciphers.caesarShift.decrypt(
                    ciphers.caesarShift.encrypt("this is a test", 4), 4),
                "this is a test")
        })
    });
});
