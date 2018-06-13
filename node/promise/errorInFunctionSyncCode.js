const Q = require('q');

const throwErrorWithProbability = (probability) => {
    const n = Math.random();
    if (n > probability) {
        throw new Error();
    }
};

const foo = () => {
    throwErrorWithProbability(0.5);
    return Q.resolve();
};

foo()
    .then(() => {
        console.log('then');
    })
    .catch(() => {
        console.log('caught');
    });
