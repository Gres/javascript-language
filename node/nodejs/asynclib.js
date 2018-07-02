const async = require('async');
const fs = require('fs');

const obj = { dev: '/dev.json', test: '/test.json', prod: '/prod.json' };
const configs = {};

async.forEachOf(obj, (value, key, callback) => {
    fs.readFile(__dirname + value, 'utf8', (err, data) => { //eslint-disable-line
        if (err) return callback(err);
        try {
            configs[key] = JSON.parse(data);
        } catch (e) {
            return callback(e);
        }
        callback();
    });
}, err => {
    if (err) console.error(err.message);
});
