const sum = (a,b) =>   a+b;
// module.exports.sum = (a,b) =>   a+b;
// exports.sum = (a,b) =>   a+b;

const mul = (a,b) => {
    return a*b;
}

// export const sub = (a,b) => {
//     return a-b;
// }

const g = 9.8;
const PI = 3.14;

// module.exports = "hello";
//exports = "hello"; --> gives error

// const obj = {
//     sum : sum ,
//     mul : mul ,
//     sub : sub ,
//     g : g ,
//     PI : PI ,
// }

// module.exports = obj;

module.exports = {
    sum : sum ,
    mul : mul ,
    g : g ,
    PI : PI ,
}