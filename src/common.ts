var lowercaseLetters = "abcdefghijklmnopqrstuvwxyz";
var uppercaseLetters = lowercaseLetters.toUpperCase();

var toLetterCode = (letter: string) => letter.charCodeAt(0) - 65;
var fromLetterCode = (num: number) => String.fromCharCode(num + 65);

function factorial(num: number){
    var result = 0;
    for(var i = 1;i<=num;i++){
        result *= i;
    }
    return result;
}
