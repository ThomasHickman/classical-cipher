import InvalidKeyException from "./InvalidKeyException"

export function nextPermutation<t>(array: t[]) {
    // Find non-increasing suffix
    var i = array.length - 1;
    while (i > 0 && array[i - 1] >= array[i])
        i--;
    if (i <= 0)
        return [];

    // Find successor to pivot
    var j = array.length - 1;
    while (array[j] <= array[i - 1])
        j--;
    var temp = array[i - 1];
    array[i - 1] = array[j];
    array[j] = temp;

    // Reverse suffix
    j = array.length - 1;
    while (i < j) {
        temp = array[i];
        array[i] = array[j];
        array[j] = temp;
        i++;
        j--;
    }
    return array;
}

export function testKeyType(key: any, expectedType: "number" | "string" | "object" | "array" | Function){
    if(expectedType == "array"){
        if(_.isArray(key)){
            throw new InvalidKeyException(key, "is not an array")
        }
    }
    else if(typeof expectedType === "object"){
        if(key instanceof expectedType){

        }
    }
}

export function testNumericArrangementOfNumbers(key: number[] | string){
    if(_.isArray(key) && key.every(el => typeof el == "number")){
        return key;
    }
    else if(typeof key === "string"){
        return key.split("").map(digitStr => {
            var digit = parseInt(digitStr);
            if(isNaN(digit)){
                throw new InvalidKeyException(key);
            }
            return digit;
        })
    }
    throw new InvalidKeyException(key);
}
