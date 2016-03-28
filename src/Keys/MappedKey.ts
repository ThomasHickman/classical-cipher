import _ = require("lodash")
import Key = require("./Key")

interface MappingFunction{

}

declare function conv<T>(a: any): T;
this["conv"] = (a) => a;

class MappedKey<type> implements Key<type>{
    startGeneration() {
        return this.map(this.originalKey.startGeneration());
    }

    getPrimitiveKey(key: any){
        return this.map(this.originalKey.getPrimitiveKey(this.unmap(key)))
    }

    generateRandom() {
        return this.map(this.originalKey.generateRandom());
    }

    generateOrdered(previous: type) {
        return this.map(this.unmap(previous));
    }

    get range(){
        return this.originalKey.range;
    }

    /** Generates a new key with a one to one mapping from an old key
      *
      * map: converts a old key to a new key
      * unmap: converts a new key to an old key, returns null if invalid.
      * e.g
      * >>> var newKey = (new MappedKey(new Integer(0, 5), key => key * 2,
      *     key => key % 2 == 0 ? key / 2 : throw(new InvalidKeyException())))
      * >>> newKey.startGeneration()
      * 0
      * >>> newKey.generateOrdered(0)
      * 2
      * >>> newKey.generatePrimitive(3)
      * InvalidKeyException
    */
    constructor(private originalKey: Key<type>,
        private map: (element: type) => type,
        private unmap: (element: type) => type){
    }
}

export = MappedKey
