
function functionThatMightReturnPromise(param) {
    if (param === 1) {
        // works as well
        // throw new Error('E1');
        return new Promise((resolve, reject) => {
        // works as well
         // throw new Error('E1');
            setTimeout(() => {
                resolve('A1');
            }, 10000);
        }); 
    }
    return 'A2';
}

function worker() {
    return new Promise((resolve, reject) => {
        resolve(functionThatMightReturnPromise(1));
    });
}

worker()
    .then(res => {
        console.log('---------------------- res ------------------------ ');
        console.log(res);
    })
    .catch(err => {
        console.log('---------------------- err ------------------------ ');
        console.log(err);
    });
