"use strict";

function twoChars(stringIn) {
    let strLength = stringIn.length;
    if (strLength < 2) {
        return "";
    } 
    return stringIn.substring(0,2) + stringIn.substring(strLength-2,strLength);
}

let twoCharsArray = stringArray => stringArray.map(twoChars);

const strArray = ["spring", "it", "cat", "b"];
const words = ["spring", "summer", "a", "ab", "abc", "autumn", "winter", "Web App"];
console.log( words )
console.log( twoCharsArray(words) );