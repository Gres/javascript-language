
const AWS = require('aws-sdk');
const fs = require('fs');
const sts = new AWS.STS();
const credentials = new AWS.SharedIniFileCredentials({ profile: 'cbtn-lx-qa' });
AWS.config.update({
    region: 'us-east-1'
});
AWS.config.credentials = credentials;

async function main() {
    const sessionData = await sts.assumeRole(
        {
            RoleArn: 'arn:aws:iam::815809335584:role/task-video-encoder',
            RoleSessionName: 'cbtn-lx-qa'
        }
    ).promise();
    AWS.config.update({
        accessKeyId: sessionData.Credentials.AccessKeyId,
        secretAccessKey: sessionData.Credentials.SecretAccessKey,
        sessionToken: sessionData.Credentials.SessionToken
    });

    const stepFunctions = new AWS.StepFunctions();

    const activityArn = 'arn:aws:states:us-east-1:815809335584:activity:step-task-video-encoder-encodingActivity';

    const activity = await stepFunctions.getActivityTask({ activityArn }).promise();
    console.log(JSON.stringify(activity, null, 3));
    const { input, taskToken } = activity;
    console.log();
}

main();
