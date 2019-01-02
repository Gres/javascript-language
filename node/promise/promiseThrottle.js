const PromiseThrottle = { };

function HasNextGeneratorAdapter(generator) {
    this.generator = generator;
    this.val = this.generator.next();
}
HasNextGeneratorAdapter.prototype.next = function () {
    const ret = this.val.value;
    this.val = this.generator.next();
    return ret;
};
HasNextGeneratorAdapter.prototype.hasNext = function () {
    return this.val && this.val.done == false;
};

/**
 * 
 * @param {*} sequence 
 *      type: array
 *          array of parameters that pass in to promiseFunction
 *      type: generator function
 *          generator function of parameters that pass in to promiseFunction
 *      type: generator object
 *          generator of parameters that pass in to promiseFunction
 *      
 * @param {*} promiseFunction 
 *      type: function 
 *          task execution function, pass in a parameter, returns a promise
 * 
 * @param {*} throttle 
 *      type: number
 *          throttle limit of concurrent executions
 */
PromiseThrottle.all = function (sequence, promiseFunction, throttle) {
    if(!PromiseThrottle.Promise){
        PromiseThrottle.Promise = Promise;
    }
    return new PromiseThrottle.Promise(function(resolve, reject){
        let generator;
        if (Array.isArray(sequence)) {
            generator = function* () {
                for (let i = 0; i < sequence.length; i++) yield sequence[i];
            }();
        } else if (sequence.constructor && sequence.constructor.name === 'GeneratorFunction') {
            // generator function
            generator = sequence();
        } else if (sequence.constructor && sequence.constructor.constructor && sequence.constructor.constructor.name === 'GeneratorFunction') {
            // generator object
            generator = sequence;
        }
        if (!generator) {
            throw new Error('Invalid Parameter Type: param');
        }
        generator = new HasNextGeneratorAdapter(generator);

        let index = 0;
        let startedTaskCount = 0;
        let endedTaskCount = 0;

        const onAllFinished = function () { return resolve(); };

        const onTaskReturns = function () {
            throttle++;
            endedTaskCount++;
        };

        let errorDisptached = false;
        const onError = function (err) {
            onTaskReturns();
            if(!errorDisptached){
                errorDisptached = true;
                return reject(err);
            }
        };

        const onTaskFinish = function () {
            onTaskReturns();
            if (generator.hasNext()) {
                return tryStartNewTask();
            }
            if (startedTaskCount <= endedTaskCount) {
                return onAllFinished();
            }
        };

        const tryStartNewTask = function () {
            while (throttle > 0 && generator.hasNext()) {
                throttle--;
                startedTaskCount++;
                promiseFunction(generator.next())
                    .then(() => onTaskFinish())
                    .catch(err => onError(err));
            }
            return;
        };
        return tryStartNewTask();
    });
};

PromiseThrottle.forEach = PromiseThrottle.all;

module.exports = PromiseThrottle;


/**
 * Examples 
 */

let params;

 /**
params = [10000, 20000, 30000, 15000, 25000, 35000];
const paramsCopy = params;
  */

// generator function
/*
params = function* () {
    for (let i = 0; i < paramsCopy.length; i++)
        yield paramsCopy[i];
};
*/

// generator object
/*
params = function* () {
    for (let i = 0; i < paramsCopy.length; i++)
        yield paramsCopy[i];
}();
*/

// large size generator
const limit = 1000000000000000000000000000000000000000000000;
let i = 1000;
params = function*() {
    while (i < limit)
        yield i++;
};

const throttleSize = 2;

PromiseThrottle.forEach(params, param => new Promise((resolve, reject) => {
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

// Real World Use Cases

const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/test');
mongoose.Promise = Promise;
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function callback() {
    addData();
});

const addData = function(){
    const limit = 1000000000000000000000000000000000000000000000;
    let i = 0;
    function* dataGenerator() {
        while (i < limit)
            yield i++;
    }
    forEachPromiseWithThrottle(dataGenerator, data => 
        new Promise((resolve, reject)=>{
            console.log(`Inserting data ${data}`);
            setTimeout(() => {
                const promise = mongoose.connection.db.collection('test').insert({ data });
                return resolve(promise);
            }, 10000);
        }), 5);
};
*/