const _ = require('lodash');
const a = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0];

function createChain() {
    let chain = Promise.resolve();
    for (let i of a) {
        chain = chain
            .then(() =>
                new Promise(resolve => {
                    console.log(i);
                    return resolve();
                })
            )
            .then(() => new Promise(r => setTimeout(r, 1000)));
    }
    return chain;
}

//createChain();


function createChainV2() {
    return _.reduce(a, (chain, i) => {
        chain = chain
            .then(() =>
                new Promise(resolve => {
                    console.log(i);
                    return resolve();
                })
            )
            .then(() => new Promise(r => setTimeout(r, 1000)));
        return chain;
    }, Promise.resolve());
}

//createChainV2();

// but sometimes you want the result of previous promise, how about an increasing counter

function localPromiseFun(prevResult) {
    return new Promise((resolve, reject) => {
        console.log(prevResult);
        return setTimeout(() => {
            return resolve(prevResult + 1);
        }, 1000);
    });
}

function createCounterChain() {
    let chain = Promise.resolve(100);
    for (let i of a) {
        chain = chain
            .then((prevResult) => {
                //return localPromiseFun(prevResult); 
                return (
					() => new Promise((resolve, reject) => {
                        console.log(prevResult);
                        setTimeout(() => resolve(prevResult + 1), 1000);
                    })
                )();
            });
    }
    return chain;
}

createCounterChain();

/*
 Todo, 
 what if you don't event want the array
 e.g. maybe we can use yeild   

 what if we don't want to chain the promise in the begining
 e.g. we want to chain the promise on the fly and terminate it at certain point 
*/