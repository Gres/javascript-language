
const AWS = require('aws-sdk');
const fs = require('fs');
const sts = new AWS.STS();
const uuidLib = require('uuid');

const credentials = new AWS.SharedIniFileCredentials({ profile: 'cbtn-lx-qa' });
AWS.config.update({
    region: 'us-east-1'
});
AWS.config.credentials = credentials;

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

    const stepFunctions = new AWS.StepFunctions();

    let params = {
        stateMachineArn,
        maxResults: 0,
        statusFilter: 'RUNNING'
    };

    const executions = await stepFunctions.listExecutions(params).promise();
    console.log(JSON.stringify(executions, null, 3));

    for (execution of executions.executions) {
        console.log(JSON.stringify(execution, null, 3));
        try {
            const result = await stepFunctions.stopExecution({ executionArn: execution.executionArn }).promise();
        } catch (error) {
            console.log(JSON.stringify(error, null, 3));
        }
    }
    console.log();
}

try {
    main();
} catch (error) {
    console.log(JSON.stringify(error, null, 3));
}
