abstract class Reporter {
    abstract setOriginalText(originalText: string);
    abstract start(numIncrement: number);
    abstract update(toWhat: number);
    abstract finish(plainText: string, key: any, strength: number);
    abstract log(text: string);
    abstract error(text: string);
}

export = Reporter
