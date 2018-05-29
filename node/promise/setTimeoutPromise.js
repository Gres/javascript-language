const setTimeoutPromise = timeout => new Promise(resolve => setTimeout(resolve, timeout));

console.log('init');
setTimeoutPromise(5000)
    .then(() => {
        console.log('after 5000');
    });
