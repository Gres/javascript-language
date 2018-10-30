const exec = require('child_process').exec;

const cmd = 'aws s3 ls';

exec(cmd, function (err, stdout, stderr) {
    if (err) {
        console.log(err, stderr);
    }

    console.log(stdout);
});
