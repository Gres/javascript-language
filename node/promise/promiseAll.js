const params = [1, 2, 3, 4];
const _ = require('lodash');

process
    .on('uncaughtException', () => {
        console.log('--------------------- uncaughtException ---------------------------');
        console.log();
    })
    .on('unhandledRejection', () => {
        console.log('--------------------- unhandledRejection ---------------------------');
        console.log();
    }); 

function anotherFunctionThatReturnsPromise() {
    return Promise.resolve();
}

function functionExpectToReturnPromise(params) { //eslint-disable-line

    if (!params) {
        throw new Error('Invalid Parameter');
    }
    return anotherFunctionThatReturnsPromise();
}

function functionExpectToReturnPromise(params) { //eslint-disable-line

    // validate parameter
    if (!params) {
        // throw new Error('Invalid Parameter');
        return Promise.reject();
    }
    // read results, configs

    // prepare parameter

    // error thrown in anotherFunctionThatReturnsPromise 
    // synchronize part of promise call, 
    //      mongoose parameter validation,  
    //      service-client parameter validation, preparation 
    //      postgres query preparation
    return anotherFunctionThatReturnsPromise();
}

/*
Promise.all(_.map(params, p => {
    throw new Error(`Test Error ${p}`);
}))
    .catch(err => {
        console.log(err);
        console.log('--------------------- caught ---------------------------');
    });
*/

/*
Promise.all(_.map(params, p => {
    try {
        throw new Error(`Test Error ${p}`);
    } catch (error) {
        return Promise.reject(error);        
    }
}))
    .catch(err => {
        // can reach here
        console.log(err);
        console.log('--------------------- caught ---------------------------');
    });
*/

/*
Promise.all(_.map(params, p =>
    new Promise((resolve, reject) => {
        throw new Error(`Test Error ${p}`);
    })
))
    .catch(err => {
        console.log(err);
        console.log('--------------------- caught ---------------------------');
    });
*/

Promise.all(_.map(params, p => {
    const deferred = Promise.defer();
    if (p) {
        throw new Error(`Test Error ${p}`);
    }
    return deferred;
}))
    .catch(err => {
        console.log(err);
        console.log('--------------------- caught ---------------------------');
    });
/*
    */