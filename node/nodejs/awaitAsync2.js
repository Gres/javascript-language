async function main() {
    try {
        async function qq(x) {
            if (x < 0) {
                return Promise.reject(new Error("neg"))
            }
            return Promise.resolve("pos");
        }
        let b = await qq(1);
        console.log(b);
    } catch (error) {
        console.log(error);
    }
}

main();