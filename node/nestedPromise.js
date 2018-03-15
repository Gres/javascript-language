const Q = require('q');

function foo() {
  return Q.promise(function (resolve, reject) {
    throw new Error('TEST ERROR A');
    return resolve();
  });
}

foo()
  .then(function () {
    console.log('DEBUG POINT A');
  })
  .catch(function(){
    console.log('ERROR CAUGHT B');
  });

/*
function bar() {
  return Q.promise(function (resolve, reject) {
    setTimeout(function(){
      throw new Error('TEST ERROR B');
    }, 0);
    return resolve();
  });
}

bar()
  .then(function () {
    console.log('DEBUG POINT B');
  })
  .catch(function(){
    console.log('ERROR CAUGHT B');
  });
  */

function bar2() {
  return Q.promise(function (resolve, reject) {
    
    Q.promise(function (resolve2, reject2) {
      setTimeout(function () {
        // Strange, this error won't result in uncaught exception
        reject2('TEST ERROR C INNER');
      }, 0);
      //reject('TEST ERROR C');
    });
    /*
    .catch(function(){
      console.log('ERROR CAUGHT C INNER');
    });
    */
    return resolve();
  });
}

bar2()
  .then(function () {
    console.log('DEBUG POINT C');
  })
  .catch(function(){
    console.log('ERROR CAUGHT C');
  });

function bar3Error(){
    throw new Error('TEST ERROR D');
    return;
}

function bar3() {
  return Q.promise(function (resolve, reject) {
    return resolve(bar3Error());
  });
} 

bar3()
  .then(function () {
    console.log('DEBUG POINT D');
  })
  .catch(function(){
    console.log('ERROR CAUGHT D');
  });

process.on('uncaughtException', function (err) {
  console.log('uncaughtException' + err);
});