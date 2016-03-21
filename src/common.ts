var lowercaseLetters = "abcdefghijklmnopqrstuvwxyz";
var uppercaseLetters = lowercaseLetters.toUpperCase();

var toLetterCode = (letter: string) => letter.charCodeAt(0) - 65;
var fromLetterCode = (num: number) => String.fromCharCode(num + 65);

function allCapsToFormattedText(input: string, original: string) {
    var output = "";
    var inputNumOn = 0;
    for (var i = 0; i < input.length; i++) {
        var charCode = original[i].charCodeAt(0);
        if (charCode >= 97 /*a*/ && charCode <= 122 /*z*/) {
            output += input[inputNumOn++].toLowerCase();
        }
        else if (charCode >= 65 /*A*/ && charCode <= 90 /*Z*/) {
            output += input[inputNumOn++].toUpperCase();
        }
        else {
            output += original[i];
        }
    }
    return output;
}

function formattedTextToAllCaps(input: string) {
    var output = "";
    for (var i = 0; i < input.length; i++) {
        var charCode = input[i].charCodeAt(0);
        if (charCode >= 97 /*a*/ && charCode <= 122 /*z*/) {
            output += String.fromCharCode(charCode - 32);
        }
        else if (charCode >= 65 /*A*/ && charCode <= 90 /*Z*/) {
            output += input[i];
        }
        else {
            //Nothing
        }
    }
    return output;
}

function factorial(num: number){
    var result = 0;
    for(var i = 1;i<=num;i++){
        result *= i;
    }
    return result;
}
