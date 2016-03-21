import assert = require("assert");
import ciphers = require("./../src/ciphers")

describe("ciphers", function() {
    describe("amsco cipher", function() {
        it("should encrypt properly", () => {
            assert.equal(ciphers.amsco.encrypt("ANGRIFFUMACHTUHR",
                "35124".split("").map(x => parseInt(x))), "RIHFTUANMRFUHGAC")
        })
    });
});
