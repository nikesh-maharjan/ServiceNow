//Daates
console.log(typeof Number("42")); 
// Expected output: "number"
console.log(typeof new Number("42"));
// Expected output: "object"
console.log(typeof 42);
// Expected output: "number"
console.log(typeof parseInt("42", 10));
// Expected output: "number"
console.log(typeof undeclaredVariable);
// Expected output: "undefined"


var stringConstructor = "test".constructor;
var arrayConstructor = [].constructor;
var objectConstructor = ({}).constructor;

function whatIsIt(object) {
    if (object === null) {
        return "null";
    }
    if (object === undefined) {
        return "undefined";
    }
    if (object.constructor === stringConstructor) {
        return "String";
    }
    if (object.constructor === arrayConstructor) {
        console.log("Arr Constructor: " + (object.constructor === Array));
        return "Array";
    }
    if (object.constructor === objectConstructor) {
        console.log("Obj Constructor: " + (object.constructor === Object));
        return "Object";
    }
    {
        return "don't know";
    }
}

var testSubjects = ["string", [1,2,3], {foo: "bar"}, 4];

for (var i=0, len = testSubjects.length; i < len; i++) {
    console.log(whatIsIt(testSubjects[i]));
}

// Use instanceof for custom types:
console.log("\n\nUse instanceof for custom types\n\n")
var ClassFirst = function () {};
var ClassSecond = function () {};
var instance = new ClassFirst();
typeof instance; // object
typeof instance == 'ClassFirst'; // false
instance instanceof Object; // true
instance instanceof ClassFirst; // true
instance instanceof ClassSecond; // false 


// Use typeof for simple built in types:
console.log("\n\nUse typeof for simple built in types:\n\n")
'example string' instanceof String; // false
typeof 'example string' == 'string'; // true

'example string' instanceof Object; // false
typeof 'example string' == 'object'; // false

true instanceof Boolean; // false
typeof true == 'boolean'; // true

99.99 instanceof Number; // false
typeof 99.99 == 'number'; // true

//function() {} instanceof Function; // true
typeof function() {} == 'function'; // true


// Use instanceof for complex built in types:
console.log("\n\nUse instanceof for complex built in types:\n\n")
// /regularexpression/ instanceof RegExp; // true
typeof /regularexpression/; // object

[] instanceof Array; // true
typeof []; //object

// {} instanceof Object; // true
typeof {}; // object