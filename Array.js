const paragraph = 'The quic quick brown fox jumps over the lazy dog. If the dog barked, was it really lazy?';

// Any character that is not a word character or whitespace
var t = "quick";
/**
 * Regex
 */
// create regex with variable
var u = new RegExp(t, "mi"); 
// regex with variable does not work
const regex = /t/g;

console.log(paragraph.search(u));
// Expected output: 9

console.log(paragraph[paragraph.search(u)]);
// Expected output: "q"

console.log(paragraph.substring(paragraph.search(u)));
// quick brown fox jumps over the lazy dog. If the dog barked, was it really lazy?

var m = paragraph.match(u);
console.log(m);


console.log(null.toString());