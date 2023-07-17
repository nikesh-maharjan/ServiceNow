function equals(arr1, arr2) {
    var returnObj = {
        result: "false",
        message: ""
    };

    if (typeof arr1 !== typeof arr2) {
        returnObj.message = "Type mismatch";
        return returnObj;
    }

    if (Array.isArray(arr1) && Array.isArray(arr2)) {
        return equalsArray(arr1, arr2);
    }
}

function equalsArray(arr1, arr2) {
    var returnObj = {
        result: "false",
        message: ""
    };

    if (!Array.isArray(arr1) || !Array.isArray(arr2)) {
        returnObj.message = "Both Objects are not Array";
        return returnObj;
    }

    if (arr1.length !== arr2.length) {
        returnObj.message = "Array length is not same";
        return returnObj;
    }

    // Do nothing since they match
    if (arr1.toString() === arr2.toString()) {
        returnObj.result = true;
        return returnObj;
    }

    var isInArr1 = arr1.every(function (item) {
        return arr2.indexOf(item) > -1;
    });
    if (!isInArr1) {
        returnObj.message = "Arrays do not contains same items";
        return returnObj;
    }

    var isInArr2 = arr2.every(function (item) {
        return arr1.indexOf(item) > -1;
    });
    if (!isInArr2) {
        returnObj.message = "Arrays do not contains same items";
        return returnObj;
    }

    if (isInArr1 && isInArr2) {
        returnObj.result = true;
        return returnObj;
    }

    return returnObj; // No way to prove that they match
}


console.log(JSON.stringify(equals(["apple","ball"], ["apple","ball"]), null, "  "));
console.log(JSON.stringify(equals(["apple","ball"], ["ball","apple"]), null, "  "));
console.log(JSON.stringify(equals(["apple","ball","cat"], ["ball","apple"]), null, "  "));
console.log(JSON.stringify(equals(["apple","ball","cat"], []), null, "  "));