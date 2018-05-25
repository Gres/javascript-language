const request = require('superagent');
const fs = require('fs');
const path = require('path');

/* fs.readFile(path.join(__dirname, 'testFile'), function read(err, data) {
    if (err) {
        throw err;
    }
    // Invoke the next step here however you like
    console.log(data);   // Put all of the code here (not the best solution)
}); */

async function foo() {
    return 1;
}

async function bar() {
    return new Promise((resolve) => {
        setTimeout(() => {
            return resolve();
        }, 1000);
    });
}

const ret = foo();
const ret2 = bar()
    .then(() => {
        console.log('test2');
    });

console.log();

async function f() {

    let promise = new Promise((resolve, reject) => {
        setTimeout(() =>
            resolve("done!"),
            1000)
    });

    let result = await promise; // wait till the promise resolves (*)

    console.log(result); // "done!"
}

f();


/* function loadJson(url) {
    return fetch(url)
        .then(response => {
            if (response.status == 200) {
                return response.json();
            } else {
                throw new Error(response.status);
            }
        })
}

loadJson('no-such-user.json') // (3)
    .catch(alert); // Error: 404 */

async function loadJson(url) {
    const response = await fetch(url);
    if (response.status == 200) {
        return response.json();
    } else {
        throw new Error(response.status);
    }
};


class HttpError extends Error {
    constructor(response) {
        super(`${response.status} for ${response.url}`);
        this.name = 'HttpError';
        this.response = response;
    }
}

function loadJson(url) {
    return fetch(url)
        .then(response => {
            if (response.status == 200) {
                return response.json();
            } else {
                throw new HttpError(response);
            }
        })
}

// Ask for a user name until github returns a valid user
function demoGithubUser() {
    let name = prompt("Enter a name?", "iliakan");

    return loadJson(`https://api.github.com/users/${name}`)
        .then(user => {
            alert(`Full name: ${user.name}.`);
            return user;
        })
        .catch(err => {
            if (err instanceof HttpError && err.response.status == 404) {
                alert("No such user, please reenter.");
                return demoGithubUser();
            } else {
                throw err;
            }
        });
}

demoGithubUser();

class HttpError extends Error {
    constructor(response) {
        super(`${response.status} for ${response.url}`);
        this.name = 'HttpError';
        this.response = response;
    }
}



// Ask for a user name until github returns a valid user
async function demoGithubUser() {
    let name = prompt("Enter a name?", "iliakan");
    try {
        const user = await loadJson(`https://api.github.com/users/${name}`)
        alert(`Full name: ${user.name}.`);
        return user;
    } catch (err) {
        if (err instanceof HttpError && err.response.status == 404) {
            alert("No such user, please reenter.");
            return demoGithubUser();
        } else {
            throw err;
        }
    }
}

demoGithubUser();