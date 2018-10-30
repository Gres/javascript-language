/**
 * 
 * @param {*} array
 *      
 * @param {*} promiseFun 
 * @param {*} throttle 
 */
function forEachPromise(array, promiseFun, throttle) {
    if (!Array.isArray(array)) {
        return Promise.reject('Invalid Parameter');
    }
    let index = 0;
    function startPromise() {
        return new Promise((resolve, reject) => {
            if (index >= array.length) {
                return resolve();
            }
            const param = array[index++];
            return promiseFun(param)
                .then(() => startPromise())
                // notice: we must resolve here
                .then(() => resolve())
                .catch(err => reject(err));
        });
    }
    return Promise.all([...Array(Math.min(array.length, throttle))].map(() => startPromise()));
}

const params = [10000, 20000, 30000, 15000, 25000, 35000];
//const params = [1, 2, 3, 4, 5, 6, 7];
const throttleSize = 1;
forEachPromise(params, param => new Promise((resolve, reject) => {
    console.log(`${param} loaded`);
    setTimeout(res => {
        console.log(Date());
        console.log(`${param} finished`);
        resolve();
    }, param);
}), throttleSize)
    .then(() => {
        console.log(Date());
        console.log('All promise finished');
    });
/* 
 */
module.exports = {
    forEachPromise
};
