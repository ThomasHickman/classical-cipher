module Keys {
    export interface cipherKeyInfo<type> {
        startGen: () => type;
        startRnd?: () => type;
        generator: (input: type) => type;
        occurences: number;
        change?: (prev: type) => type;
        converstions?: {
            typeFrom: string;
            convert: (from: any) => type
        }[];
        changeParameters?: Function;
        fixedLength?: number;
    }
    export function numbers(min: number, max: number): cipherKeyInfo<number> {
        return {
            startGen: () => min,
            generator: (input: number) => input + 1,
            occurences: max - min,
            change: (prev) => {
                console.error("Not Implemented");
                return prev
            },
        }
    }
    export abstract class repeatedBaseClass<type extends {
        length: number
    }>{
        constructor(selectionArr: type, keyLength) {
            this.changeParameters(keyLength, selectionArr);
        }
        changeParameters(newLength: number, selectionArr: type) {
            if (selectionArr !== undefined)
                this.selectionArr = selectionArr;
            if (newLength !== undefined) {
                this.keyLength = newLength;
                this.occurences = Math.pow(this.selectionArr.length, newLength);
            }
        }
        keyLength = 5;
        selectionArr: type;
        occurences: number;
    }
    export class repeatedCharaters<type> extends repeatedBaseClass<type[]> implements cipherKeyInfo<Array<type>> {
        constructor(selectionArr: type[], keyLength = 5) {
            super(selectionArr, keyLength);
        }
        startGen() {
            var retSt = [];
            for (var i = 0; i < this.keyLength; i++) {
                retSt.push(this.selectionArr[0]);
            }
            return retSt;
        }
        startRnd() {
            var retSt = [];
            for (var i = 0; i < this.keyLength; i++) {
                retSt.push(this.selectionArr[Math.floor(Math.random() * this.selectionArr.length)]);
            }
            return retSt;
        }
        generator(input: type[]) {
            var retValue = input;
            var currentProc = 0;
            while (true) {
                var index = this.selectionArr.indexOf(retValue[currentProc]);
                if (index < this.selectionArr.length - 1) {
                    retValue[currentProc] = this.selectionArr[index + 1];
                    break;
                }
                else {
                    retValue[currentProc] = this.selectionArr[0];
                    currentProc++;
                }
            }
            return retValue;
        }
        change(prev: type[]) {
            var retValue = prev;
            var pos = Math.floor(Math.random() * this.keyLength);
            retValue[pos] = this.selectionArr[Math.floor(Math.random() * this.selectionArr.length)];
            return retValue;
        }
    }
    export class repeatedNumbers extends repeatedCharaters<number>{
        constructor(range: { from: number; to: number }, keyLength = 5) {
            //TODO: Potential performence improvement here - remove the inherited class's indexOf
            var selectionArr = <number[]>[];
            for (var i = range.from; i < range.to; i++) {
                selectionArr.push(i);
            }
            super(selectionArr, keyLength);
        }
    }
    export class repeatedLetters extends repeatedBaseClass<string>  implements cipherKeyInfo<string> {
        constructor(selectionArr: string, keyLength = 5) {
            super(selectionArr, keyLength);
        }
        startGen() {
            var retSt = "";
            for (var i = 0; i < this.keyLength; i++) {
                retSt += this.selectionArr[0];
            }
            return retSt;
        }
        startRnd() {
            var retSt = "";
            for (var i = 0; i < this.keyLength; i++) {
                retSt += fromLetterCode(Math.floor(Math.random() * this.selectionArr.length));
            }
            return retSt;
        }
        generator(input: string) {
            var retValue = input.split("");
            var currentProc = 0;
            while (true) {
                var charCode = retValue[currentProc].charCodeAt(0);
                if (charCode <= 63 + this.selectionArr.length) {
                    retValue[currentProc] = String.fromCharCode(charCode + 1);
                    break;
                }
                else {
                    retValue[currentProc] = this.selectionArr[0];
                    currentProc++;
                }
            }
            return retValue.join("");
        }
        change(prev: string) {
            var retValue = prev.split("");
            var pos = Math.floor(Math.random() * this.keyLength);
            retValue[pos] = this.selectionArr[Math.floor(Math.random() * this.selectionArr.length)];
            return retValue.join("");
        }
    }/*
    export function arrangementOfAlphebet(text = allupperletters): cipherKeyInfo<string> {
        function nextPermutation(array) {
            // Find non-increasing suffix
            var i = array.length - 1;
            while (i > 0 && array[i - 1] >= array[i])
                i--;
            if (i <= 0)
                return false;

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
        return {
            startGen: () => {
                return text
            },
            startRnd: () => {
                var retValue = [];
                var tmpTextCopy = text.split("");
                for (var i = 0; i < text.length; i++) {
                    var rndPos = Math.floor(Math.random() * tmpTextCopy.length);
                    retValue.push(tmpTextCopy[rndPos]);
                    tmpTextCopy.splice(rndPos, 1);
                }
                return retValue.join("");
            },
            generator: (prev: string) => {
                return nextPermutation(prev.split("").map((el) => el.charCodeAt(0) - 97)).map((el) => String.fromCharCode(el + 97)).join("")
            },
            change: (prev) => {
                var buffer = '';
                var retValue = prev.split("");
                var rnd = Math.floor(Math.random() * 26);
                var rnd2 = Math.floor(Math.random() * 25);
                if (rnd2 >= rnd)
                    rnd2++
                buffer = retValue[rnd];
                retValue[rnd] = retValue[rnd2];
                retValue[rnd2] = buffer;
                return retValue.join("");
            },
            occurences: 4.0329146112660716e+26
        }
    }*/
    function orderedArray(upTo: number) {
        var retValue = <number[]>[];
        for (var i = 0; i < upTo; i++) {
            retValue.push(i + 1);
        }
        return retValue;
    }
    function nextPermutation<t>(array: t[]) {
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
    export class arrangementOfLetters implements cipherKeyInfo<string>{
        occurences: number;
        private text: string;
        fixedLength: number;
        constructor(initialText: string) {
            this.text = initialText;
            this.fixedLength = initialText.length;
            this.occurences = factorial(initialText.length);
        }
        startGen() {
            return this.text;
        }
        startRnd() {
            var retValue = [];
            var tmpTextCopy = this.text.split("")
            for (var i = 0; i < this.text.length; i++) {
                var rndPos = Math.floor(Math.random() * tmpTextCopy.length);
                retValue.push(tmpTextCopy[rndPos]);
                tmpTextCopy.splice(rndPos, 1);
            }
            return retValue.join("");
        }
        generator(prev: string) {
            return nextPermutation(prev.split("")).join("");
        }
        change(prev: string) {
            var arr = prev.split("");
            var buffer = "";
            var retValue = arr;
            var rnd = Math.floor(Math.random() * this.text.length);
            var rnd2 = Math.floor(Math.random() * this.text.length);
            buffer = retValue[rnd];
            retValue[rnd] = retValue[rnd2];
            retValue[rnd2] = buffer;
            return retValue.join("");
        }/*
        converstions = [{
            typeFrom: "string",
            convert: (from: string) => {
                var fromArr = from.split("");
                var charCodes = fromArr.map((el) => el.charCodeAt(0));
                charCodes.sort((a, b) => a - b);
                var retValue = <number[]>[];
                fromArr.forEach((el) => retValue.push(charCodes.indexOf(el.charCodeAt(0))))
                return retValue.map((el) => el + 1);
            }
        }]*/
    }
    export class arrangementOfNumbers implements cipherKeyInfo<number[]>{
        keyLength: number;
        occurences: number;
        private text: number[];
        constructor(keyLength = 0) {
            this.changeParameters(keyLength);
        }
        changeParameters(newLength: number) {
            this.keyLength = newLength;
            this.occurences = factorial(newLength);
            this.text = orderedArray(this.keyLength);
        }
        startGen() {
            return this.text;
        }
        startRnd() {
            var retValue = [];
            var tmpTextCopy = this.text.slice(0)//Hard Copy;
            for (var i = 0; i < this.text.length; i++) {
                var rndPos = Math.floor(Math.random() * tmpTextCopy.length);
                retValue.push(tmpTextCopy[rndPos]);
                tmpTextCopy.splice(rndPos, 1);
            }
            return retValue;
        }
        generator (prev: number[]){
            return nextPermutation(prev);
        }
        change (prev: number[]) {
            var buffer = 0;
            var retValue = prev;
            var rnd = Math.floor(Math.random() * this.keyLength);
            var rnd2 = Math.floor(Math.random() * this.keyLength);
            buffer = retValue[rnd];
            retValue[rnd] = retValue[rnd2];
            retValue[rnd2] = buffer;
            return retValue;
        }
        converstions = [{
            typeFrom: "string",
            convert: (from: string) => {
                var fromArr = from.split("");
                var charCodes = fromArr.map((el) => el.charCodeAt(0));
                charCodes.sort((a, b) => a - b);
                var retValue = <number[]>[];
                fromArr.forEach((el) => retValue.push(charCodes.indexOf(el.charCodeAt(0))))
                return retValue.map((el) => el + 1);
            }
        }]
    }
    /*export function arrangementOfNumbers(keyLength = 5): cipherKeyInfo<number[]> {
        function nextPermutation(array: number[]) {
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
        return {
            startGen: () => {
                return text
            },
            startRnd: () => {
                var retValue = [];
                var tmpTextCopy = text;
                for (var i = 0; i < text.length; i++) {
                    var rndPos = Math.floor(Math.random() * tmpTextCopy.length);
                    retValue.push(tmpTextCopy[rndPos]);
                    tmpTextCopy.splice(rndPos, 1);
                }
                return retValue;
            },
            generator: (prev: number[]) => {
                return nextPermutation(prev);
            },
            change: (prev) => {
                var buffer = 0;
                var retValue = prev;
                var rnd = Math.floor(Math.random() * 26);
                var rnd2 = Math.floor(Math.random() * 25);
                if (rnd2 >= rnd)
                    rnd2++
                buffer = retValue[rnd];
                retValue[rnd] = retValue[rnd2];
                retValue[rnd2] = buffer;
                return retValue;
            },
            converstions: [{
                typeFrom: "string",
                convert: (from: string) => {
                    var fromArr = from.split("");
                    var charCodes = fromArr.map((el) => el.charCodeAt(0));
                    charCodes.sort((a, b) => a - b);
                    var retValue = <number[]>[];
                    fromArr.forEach((el) => retValue.push(charCodes.indexOf(el.charCodeAt(0))))
                    return retValue.map((el) => el+1);
                }
            }],
            occurences: 4.0329146112660716e+26,
        }
    }*/
}

export = Keys
