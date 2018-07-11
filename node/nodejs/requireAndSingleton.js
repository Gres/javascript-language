const path = require('path');
console.log('In ' + path.basename(__filename)); //eslint-disable-line


/* console.log('require one');
require('./requireTest/requireDummyObject');
console.log('require two');
require('./requireTest/requireDummyObject');
console.log('require three');
const obj = require('./requireTest/requireDummyObject');
console.log('access dummy obj.bar');
const x = obj.bar; */


/* console.log('require one');
require('./requireTest/requireDummyObject2');
console.log('require two');
require('./requireTest/requireDummyObject2');
console.log('require three');
const obj = require('./requireTest/requireDummyObject2');
console.log('access dummy obj.bar');
const x = obj.bar; */

console.log('require one');
require('./requireTest/requireDummyFunction');
console.log('require two');
require('./requireTest/requireDummyFunction');
console.log('require three');

console.log('after all requires');
