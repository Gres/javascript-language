const Q = require('q');
const promiseArr = [];

/*
promiseArr.push(function () {
  return Q.promise(function (resolve, reject) {
    console.log('Entered A');
    setTimeout(function () {
      console.log('Resolved A');
      resolve();
    }, 10);
  });
});
*/

/*
promiseArr.push(function () {
  return Q.promise(function (resolve, reject) {
    console.log('Entered B');
    setTimeout(function () {
      console.log('Resolved B');
      resolve();
    }, 1000);
  });
});
*/

promiseArr.push(function () {
  return Q.promise(function (resolve, reject) {
    console.log('Entered C');
    setTimeout(function () {
      console.log('Rejected C');
      reject('UNHANDLED REJECT');
    }, 1000);
  });
});

let idx = 0;
function executePromiseFun() {
  if (idx >= promiseArr.length) {
    return Q.resolve(false);
  }
  return promiseArr[idx]()
    .then(function (result) {
      idx++;
      return executePromiseFun();
    });
}
executePromiseFun()
.catch(function(err){
  console.log(err);
});