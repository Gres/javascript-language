
const foo = new Promise((resolve) => resolve());
const bar = foo
    .then(() => {
        console.log();
    });
const foo2 = foo;
console.log(foo2 === foo);
console.log(foo === bar);
console.log('-------------------------------------------------');

const bar1 = foo
    .then(() => {
        console.log();
    });

const bar2 = foo
    .then(() => {
        console.log();
    });

const bar3 = foo
    .then(() => {
        console.log();
    });

console.log(bar1 === bar2);
console.log(bar2 === bar3);
console.log('-------------------------------------------------');

const fooXray = new Promise((resolve) => resolve());
const fooCopy = fooXray;
const barXray = fooXray
    .then(() => {
        console.log();
    });

console.log(fooXray === fooCopy);
console.log('-------------------------------------------------');

console.log('1. Every foo.then returns a different promise than foo');
console.log('2. foo.then call does not change foo, foo stays the same');
console.log('3. we can call then multiple times on foo, each call execute in concurrent and returns distinct promises');