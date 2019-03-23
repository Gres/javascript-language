
const VIDEO = process.argv[2] || 'long';
console.log(VIDEO);

const AWS = require('aws-sdk');
const fs = require('fs');
const sts = new AWS.STS();
const uuidLib = require('uuid');
const credentials = new AWS.SharedIniFileCredentials({ profile: 'cbtn-lx-qa' });
AWS.config.update({
    region: 'us-east-1'
});
AWS.config.credentials = credentials;

const createId = function (suffix) {
    return `${uuidLib.v4().replace(/-/g, '')}-${suffix}`;
};

const count = 20;

const sequential = require('promise-sequential-throttle');
let i = 0;
const generatorFunction = function* () {
    while (i < count)
        yield i++;
};
const generatorObject = generatorFunction();


const createStepFunctionExecution = () => {
    const stateMachineArn = 'arn:aws:states:us-east-1:815809335584:stateMachine:step-task-video-encoder-encodeOneSpeed';
    const input = JSON.stringify({
        encodeId: '7004d192791947aba77893ded4185600-enc',
        encodeStartMS: new Date().getTime(),
        inputFile: `s3://cbtn-lx-qa-us-east-1-video-source/${VIDEO}.avi`,
        originatingWorkflowId: createId('wrk'),
        s3URL: `s3://cbtn-lx-qa-us-east-1-video-source/${VIDEO}.avi`,
        speed: '08',
        videoId: '5c75b4fa34efe70301b4fa77',
        watermark: null
    });

    const params = {
        stateMachineArn,
        input
    };

    const stepFunctions = new AWS.StepFunctions();

    return stepFunctions.startExecution(params).promise();
};

async function main() {
    const sessionData = await sts.assumeRole(
        {
            RoleArn: 'arn:aws:iam::815809335584:role/service-video-encoder',
            RoleSessionName: 'cbtn-lx-qa'
        }
    ).promise();
    AWS.config.update({
        accessKeyId: sessionData.Credentials.AccessKeyId,
        secretAccessKey: sessionData.Credentials.SecretAccessKey,
        sessionToken: sessionData.Credentials.SessionToken
    });

    sequential.all(generatorObject,
        createStepFunctionExecution
        , 2)
        .then(() => console.log('All promise finished in sequence'));
}
main();
