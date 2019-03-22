
const AWS = require('aws-sdk');
const fs = require('fs');
const sts = new AWS.STS();
const uuidLib = require('uuid');
const credentials = new AWS.SharedIniFileCredentials({ profile: 'cbtn-dev' });
AWS.config.update({
    region: 'us-west-2'
});
AWS.config.credentials = credentials;

const createId = function (suffix) {
    if(suffix){
        return `${uuidLib.v4().replace(/-/g, '')}-${suffix}`;
    }
    return `${uuidLib.v4().replace(/-/g, '')}`;
};

const VIDEO = 'short';
//const VIDEO = 'long';
//const VIDEO = 'longest';

async function main() {
    const stateMachineArn = 'arn:aws:states:us-west-2:775101116967:stateMachine:step-task-video-encoder-encodeOneSpeed';
    const input = JSON.stringify({
            encodeId: '7004d192791947aba77893ded4185600-enc',
            encodeStartMS: 192791947,
            inputFile: `s3://cbtn-dev-video-source/${VIDEO}.avi`,
            originatingWorkflowId: createId('wrk'),
            s3URL: `s3://cbtn-dev-video-source/${VIDEO}.avi`,
            speed: '08',
            videoId: '5c75b4fa34efe70301b4fa77',
            watermark: null
        });

    const params = {
        stateMachineArn,
        input
    };

    const stepFunctions = new AWS.StepFunctions();

    const result = await stepFunctions.startExecution(params).promise();
    console.log(JSON.stringify(result, null, 3));

    console.log();

}
main();
