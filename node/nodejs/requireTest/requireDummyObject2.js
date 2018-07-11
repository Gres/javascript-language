console.log('ENTRY POINT A');
const exportObj = {
    foo: () => {
        console.log('ENTRY POINT B');
    },
    bar: (() => {
        console.log('ENTRY POINT C');
    })()
};
module.exports = exportObj; 
