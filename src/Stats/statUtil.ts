export var RealLetterProb = [8.167, 1.492, 2.782, 4.253, 12.702, 2.228, 2.015, 6.094, 6.966, 0.153, 0.772, 4.025, 2.406, 6.749, 7.507, 1.929, 0.095, 5.987, 6.327, 9.056, 2.758, 0.978, 2.360, 0.150, 1.974, 0.074];

export function countLetterOccurences(letter: string, text: string) {
    var sum = 0;
    for (var y = 0; y <= text.length - 1; y++) {
        if (text[y] == letter) {
            sum += 1;
        }
    }
    return sum;
}
