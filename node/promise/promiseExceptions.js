const Q = require('q');

/* const promise = 
    Q.Promise((resolve, reject) => {
        throw new Error('a');
    })
    .then(() => {
        console.log('then');
    })
    .catch(() => {
        console.log('catch');
    });
 */
/* const promise2 = 
    Q.Promise((resolve, reject) => {
        return Q.reject(new Error('b'));
    })
    .then(() => {
        console.log('then2');
    })
    .catch(() => {
        console.log('catch2');
    }); */

function promiseWithUncaughtException() {
    return Q.Promise((resolve, reject) => {
        //throw new Error('d');
        setTimeout(() => {
            throw new Error('c');
        }, 0);
    });
}

/* const promise3 =
    Q.Promise((resolve, reject) => {
        promiseWithUncaughtException()
            .then(() => {
                return resolve();
            })
            .catch((err) => {
                return reject(err);
            });
    })
        .then(() => {
            console.log('then3');
        })
        .catch((err) => {
            console.log('catch3');
        }); */

// nested promise have to catch all exception?

const promise4 =
    Q.Promise((resolve, reject) => {
    /* try catch is not a must, because synchronous code can be caught directly          
        try {
            
        } catch (error) {
            
        } 
    */
        Q.delay(1000)
            .then(() => {
                // if no catch setup after this, no uncaught error, it got swallowed
                throw new Error('error in side a promise');
            })
                // this line must be added, to throw error out
            .catch(reject)
        })
        .then(() => {
            console.log('then4');
        })
        .catch((err) => {
            console.log('catch4');
        });