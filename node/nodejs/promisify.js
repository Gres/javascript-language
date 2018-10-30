const { promisify } = require('util');

const fs = require('fs');
const readFileAsync = promisify(fs.readFile); // (A)

const filePath = process.argv[2];

readFileAsync(filePath, { encoding: 'utf8' })
    .then((text) => {
        console.log('CONTENT:', text);
    })
    .catch((err) => {
        console.log('ERROR:', err);
    });