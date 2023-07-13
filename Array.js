const paragraph = 'The quic quick brown fox jumps over the lazy dog. If the dog barked, was it really lazy?';

// Any character that is not a word character or whitespace
var t = "quicka";
var u = new RegExp(t, "mi");
const regex = /t/g;

console.log(paragraph.search(u));
// Expected output: 43

console.log(paragraph[paragraph.search(u)]);
// Expected output: "."

console.log(paragraph.substring(9));

var m = paragraph.match(u);
console.log(m);

console.log(null.toString());