const Q = require('q');
const promiseArray = [];

promiseArray.push(new Q.Promise(function(resolve, reject){
    // This part of code is in current stack, executed immediately
   console.log("Promise 1"); 
   resolve();
}));

function promiseFunction() {
    return new Q.Promise(function (resolve, reject) {
    // This part of code is in current stack, executed immediately
        console.log("Promise 2");
        resolve();
    });
}

console.log('Point one');
promiseFunction();
console.log('Point two');