console.log('ENTRY POINT A');
const testObj = {
    foo: () => {
        console.log('ENTRY POINT B');
    },
    bar: (() => {
        console.log('ENTRY POINT C');
    })()
};
module.exports = {
    foo: () => {
        console.log('ENTRY POINT D');
    },
    bar: (() => {
        console.log('ENTRY POINT E');
    })()
};
console.log('ENTRY POINT F');
