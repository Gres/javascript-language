
const AWS = require('aws-sdk');
const fs = require('fs');
const _ = require('lodash');

const sts = new AWS.STS();
const credentials = new AWS.SharedIniFileCredentials({ profile: 'cbtn-lx-qa' });
AWS.config.update({
    region: 'us-east-1'
});
AWS.config.credentials = credentials;

const VIDEO = 'short';

async function assumeRole(service, roleName) {
    roleName = roleName || 'developers/developer-read-only-access';
    service = service || AWS;
    const sessionData = await sts.assumeRole(
        {
            RoleArn: `arn:aws:iam::815809335584:role/${roleName}`,
            RoleSessionName: 'cbtn-lx-qa'
        }
    ).promise();
    service.config.update({
        accessKeyId: sessionData.Credentials.AccessKeyId,
        secretAccessKey: sessionData.Credentials.SecretAccessKey,
        sessionToken: sessionData.Credentials.SessionToken
    });
}

async function main() {
    await assumeRole();

    params = {
        cluster: 'Task-Runner-Tasks',
        desiredStatus: 'RUNNING',
        family: 'task-video-encoder'
    };

    const ecs = new AWS.ECS();

    const result = await ecs.listTasks(params).promise();
    const { taskArns } = result;
    console.log(JSON.stringify(result, null, 3));

    await assumeRole(ecs, 'service-task-runner-v2');

    const results = await Promise.all(_.map(taskArns, async (task) => {
        params = {
            task,
            cluster: 'Task-Runner-Tasks',
            reason: 'dev'
        };
        return ecs.stopTask(params).promise();
    }));

    console.log(JSON.stringify(results, null, 3));

    console.log();
}
main();
