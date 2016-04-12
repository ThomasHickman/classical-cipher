import Reporter = require("./Reporter")

class SilentReporter extends Reporter{

    setOriginalText(originalText: string){
    }

    start(numIncrement: number){
    }

    update(toWhat = 7){
    }

    finish(plainText: string, key: any, strength: number){
    }

    log(text: string){
    }

    error(text: string){
    }
}

export = SilentReporter;
