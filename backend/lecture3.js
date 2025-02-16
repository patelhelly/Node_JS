// module.export : special object used to export properties or methods to other file of same directory
//require : a build-in func.to include external module that exist in separate files.

const math = require("./math.js");
// './' indicate file in same directory 

console.log(math);
// Output :{
//     sum: [Function: sum],
//     mul: [Function: mul],
//     sub: [Function: sub],
//     g: 9.8,
//     PI: 3.14
//   }
console.log(math.sum(5,5));
// -> 10
console.log(math.mul(5,5));
// -> 25
console.log(math.PI);
// -> 3.14


const fruits = require('./Fruits');

console.log(fruits);
console.log(fruits[0]);