const Q = require('q');
const promiseArr = [];

/** 
 * In this pattern, even B and C is rejected, they still have to wait for A
 * after A resolve or reject, they can resolve themself
 *  
*/

promiseArr.push(
  Q.promise(function (resolve, reject) {
    console.log('Entered A');
    setTimeout(function () {
      console.log('Resolved A');
      resolve();
      //console.log('Reject A');
      //reject('UNHANDLED REJECT A');
    }, 10000);
  })
);

promiseArr.push(
  Q.promise(function (resolve, reject) {
    console.log('Entered B');
    setTimeout(function () {
      // console.log('Resolved B');
      //resolve();
      console.log('Reject B');
      reject('UNHANDLED REJECT B');
    }, 100);
  })
);

promiseArr.push(
  Q.promise(function (resolve, reject) {
    console.log('Entered C');
    setTimeout(function () {
      console.log('Reject C');
      reject('UNHANDLED REJECT C');
    }, 10);
  })
);

let idx = 0;
function executePromiseFun() {
  if (idx >= promiseArr.length) {
    return Q.resolve(false);
  }
  return promiseArr[idx]
    .then(function (result) {
      idx++;
      return executePromiseFun();
    });
}
executePromiseFun()
.then(function(){
  console.log("Before Party ... ");
})
.catch(function(err){
  console.log("ERROR CAUGHT " + err);
})
.then(function(){
  console.log("After party ... ");
});