/*  
FATAL ERROR: CALL_AND_RETRY_LAST Allocation failed - JavaScript heap out of memory
*/

function foo() {
    const a = new Array(100000);
    console.log(`Memory Usage: ${JSON.stringify(process.memoryUsage())}`);
    foo();
}

foo();

/*  
RangeError: Maximum call stack size exceeded
*/

/* 
function foo() {
    const b = [0];
    const c = [1];
    console.log(`Memory Usage: ${JSON.stringify(process.memoryUsage())}`);
    foo();
}

foo();
 */