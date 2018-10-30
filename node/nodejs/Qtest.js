const Q = require('q');

Q.all([
    Q.resolve(1),
    Q.resolve(2)
])
    .then(res => {
        console.log(res);
    });

Promise.all([
    Promise.resolve(1),
    Promise.resolve(2)
])
    .then(res => {
        console.log(res);
    });
