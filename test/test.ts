import cc = require("../dist/index");
import assert = require("assert");
import _ = require("lodash");

function get_diff_count(text1: string, text2: string){
    var diff_count = 0;
    text1.split("").forEach((el, i) => {
        if(el != text2[i]){
            diff_count++;
        }
    })
    return diff_count;
}

describe("solvers", () => {
    it("solves ceasar shift using brute force", () => {
        assert(cc.solvers.bruteForce.solve({
            cipherText: "Alza zaypun!",
            cipher: cc.ciphers.caesarShift,
            stat: cc.stats.chiSquared,
            reporter: cc.reporters.silentReporter
        }).text, "Test string!")
    })

    it("solves transposition using hill climbing", () => {
        var cipherText = "KLUSUSRKASKWASSRGAXLUPLUSSVYYNSKKNTNIINXKLAMUSKCUHVKUNDNTKLAADGIUSLRIYLRHAK";
        var key = 'RHPMATGLUOFIWDNYBCSKVQXJEZ';
        var plainText = "THISISATESTMESSAGEWHICHISSUPPOSTTOFOLLOWTHEDISTRIBUTIONOFTHEENGLISHALPHABET";
        var result = cc.solvers.hillClimbing.solve({
            cipherText: cipherText,
            cipher: cc.ciphers.simpleSubstitution,
            stat: cc.stats.chiSquared,
            reporter: cc.reporters.silentReporter
        });
        assert(get_diff_count(plainText, result.text) < 10); // Hasn't got more than 10 differences
    })
})

describe("abstract ciphers", () => {
    it("formats and unformats strings", () => {
        assert(cc.util.unformat("Test string!"), "TESTSTRING")
        assert(cc.util.format("TSTSSTRNGY", "Test string!"), "Tsts strngy!")
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
    it("hill cipher", () => {
        assert.equal(
            cc.ciphers.hillCipher.encrypt("HELP", [3, 3, 2, 5]),
            "HIAT")
        })
    it("rail fence", () => {
        assert.equal(
            cc.ciphers.railFence.encrypt("WE ARE DISCOVERED. FLEE AT ONCE", 3, {formatResult: false}),
            "WECRLTEERDSOEEFEAOCAIVDEN")
        })
})

describe("self-tests:", () => {
    var testString = "test string";
    var notFinishedCiphers = [
        "Playfair"
    ];
    var randomParameters = {
        "ColumnTransposition": [5/*change is the test string changes*/]
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
