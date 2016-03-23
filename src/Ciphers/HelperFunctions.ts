/** Same as letterCodeMap, but the function shoudl take in a letter and output a letter code*/
export function letterCodeOutputMap(input: string, func: (inp: string, pos: number) => number) {
    var output = "";
    for (var i = 0; i < input.length; i++) {
        output += String.fromCharCode(func(input[i], i) + 65);
    }
    return output;
}

/** Same as letterCodeMap, but the function should take in a letter code and output a letter*/
export function letterCodeInputMap(input: string, func: (inp: number, pos: number) => string) {
    var output = "";
    for (var i = 0; i < input.length; i++) {
        output += func(input[i].charCodeAt(0) - 65, i);
    }
    return output;
}

/** Maps a string to another string using the func as the letter code mapping
  * e.g.
  * >>> letterCodeMap("abc", code => code + 1)
  * "bcd"
  * >>> letterCodeMap("abc", code => code * 2)
  * "abe"
  */
export function letterCodeMap(input: string, func: (inp: number, pos: number) => number) {
    var output = "";
    for (var i = 0; i < input.length; i++) {
        var charCode = input[i].charCodeAt(0);
        output += String.fromCharCode(func(charCode - 65, i) + 65);
    }
    return output;
}
/** Mod such that negative numbers are handled correctly
  * >>> cMod(-5, 20)
  * 20
  */
export function cMod(num: number, base: number) {
    return num > 0 ? num % base : (base + ((num) % base)) % base;
}

/**Resorts an array such that undoPermutation(applyPermutation(arr, other), other) == arr
 * >>> undoPermutation([7, 1, 5], [3, 1, 2])
 * [1, 5, 7]
 */
export function undoPermutation<type>(arrToReArrange: type[], order: number[]) {
    var retValue = <[type, number][]>arrToReArrange.map((el, i) => [el, order[i]]);
    retValue.sort((a, b) => a[1] - b[1]);
    return retValue.map((el) => el[0]);
}

/**Resorts an array according to a given permutation
 * >>> applyPermutation([1, 5, 7], [3, 1, 2])
 * [7, 1, 5]
 */
export function applyPermutation<type>(arr: type[], permutation: number[]) {
    var retValue: type[] = new Array(permutation.length);
    permutation.forEach((el, i) => retValue[i] = arr[el - 1]);
    return retValue;
}

export function transpose<type>(arr: type[]){
    return <type[]>_.zip.apply(_, arr)
}