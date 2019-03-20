
const AWS = require('aws-sdk');
const fs = require('fs');
const sts = new AWS.STS();
const credentials = new AWS.SharedIniFileCredentials({ profile: 'cbtn-lx-qa' });
AWS.config.update({
    region: 'us-east-1'
});
AWS.config.credentials = credentials;

const VIDEO = 'short';
//const VIDEO = 'long';

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

    const stateMachineArn = 'arn:aws:states:us-east-1:815809335584:stateMachine:step-task-video-encoder-encodeOneSpeed';
    const input = JSON.stringify({
            encodeId: '7004d192791947aba77893ded4185600-enc',
            encodeStartMS: 192791947,
            inputFile: `s3://cbtn-lx-qa-us-east-1-video-source/${VIDEO}.avi`,
            originatingWorkflowId: 'f76c01f549b94988bb61d4136f0ac86d-wrk',
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

    const result = await stepFunctions.startExecution(params).promise();
    console.log(JSON.stringify(result, null, 3));

    console.log();

}
main();
