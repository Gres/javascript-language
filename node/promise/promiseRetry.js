async function sleep(milliseconds) { //eslint-disable-line
    return new Promise((resolve, reject) => setTimeout(() => resolve(), milliseconds));
}

const PROMISE_RETRY_MAX = 3;
const PROMISE_RETRY_TIMEOUT = 0;
/** 
 * promiseFunc: a function that returns a promise 
*/
function promiseRetry(promiseFunc, retryTimeout = PROMISE_RETRY_TIMEOUT, retryMax = PROMISE_RETRY_MAX) {
    try {
        const tryOnce = tryCount =>
            promiseFunc()
                .catch(error => {
                    if (tryCount < PROMISE_RETRY_MAX) {
                        console.log(tryCount);
                        return tryOnce(tryCount + 1);
                    }
                    throw error;
                });
        return tryOnce(0);
    } catch (error) {
        return Promise.reject(error);
    }
}

function testRejectPromise(){
    return sleep(1000)
        .then(() => Promise.reject());
}

promiseRetry(testRejectPromise)
    .catch(err => {
        console.log('caught');
    });