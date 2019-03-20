
const AWS = require('aws-sdk');
const fs = require('fs');
const sts = new AWS.STS();
const credentials = new AWS.SharedIniFileCredentials({ profile: 'cbtn-lx-qa' });
AWS.config.update({
    region: 'us-east-1'
});
AWS.config.credentials = credentials;

const VIDEO = 'short';

async function assumeRole(roleName){
    roleName = roleName || 'developers/developer-read-only-access';
    const sessionData = await sts.assumeRole(
        {
            RoleArn: `arn:aws:iam::815809335584:role/${roleName}`,
            RoleSessionName: 'cbtn-lx-qa'
        }
    ).promise();
    AWS.config.update({
        accessKeyId: sessionData.Credentials.AccessKeyId,
        secretAccessKey: sessionData.Credentials.SecretAccessKey,
        sessionToken: sessionData.Credentials.SessionToken
    });
}

async function main() {
    //await assumeRole('service-task-runner-v2');
    await assumeRole('developers/developer-read-only-access');

    params = {
        cluster: 'Task-Runner-Tasks',
        desiredStatus: 'RUNNING',
        family: 'task-video-encoder'
    };

    const ecs = new AWS.ECS();

    const result = await ecs.listTasks(params).promise();
    console.log(JSON.stringify(result, null, 3));

    console.log();
}
main();
