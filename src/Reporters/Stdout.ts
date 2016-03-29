import Reporter = require("./Reporter")

class Stdout extends Reporter{
    private numIncrement: number;
    private incrementOn = 0;
    private originalText: string;

    setOriginalText(originalText: string){
        this.originalText = originalText;
    }

    start(numIncrement: number){
        this.numIncrement = numIncrement;
    }

    update(toWhat = ++this.incrementOn){
        console.log("Completed " + Math.floor((toWhat / this.numIncrement) * 100) + "%");
    }

    finish(plainText: string, key: any, strength: number){
        console.log("Task Finished");
        console.log(plainText);
        console.log("Strength: " + strength);
        console.log("Key: " + key);
    }

    log(text: string){
        console.log(text);
    }

    error(text: string){
        console.error(text);
    }
}

export = Stdout;
