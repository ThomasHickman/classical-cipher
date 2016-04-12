interface Indexable{
    length: number;
    [index: number]: any;
}

interface Key<internalKeyType> {
    startGeneration(): internalKeyType;
    /** generates the logical next key, or if the next key is at the top, null*/
    generateOrdered(previous?: internalKeyType): internalKeyType;
    /**Sees if the input is a valid key, if it is convert it to the required
      * primitive value, if it isn't throws an Error*/
    getPrimitiveKey(value: any): internalKeyType;
    /**Generates a random key */
    generateRandom: (...args) => internalKeyType;
    range: number;
    conversions?: {
        typeFrom: string;
        convert: (from: any) => internalKeyType
    }[];
    //changeParameters?: Function;
    fixedLength?: number;
}

export = Key
