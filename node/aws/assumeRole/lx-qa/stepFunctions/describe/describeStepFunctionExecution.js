const _ = require('lodash');
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
    //console.log(JSON.stringify(executions, null, 3));

    const timeoutActivity = [];
    const startedActivity = [];
    const succeededActivity = [];

    const getExecutionHistory = (input) => {
        const { executionArn } = input;
        const params = {
            executionArn,
            maxResults: 0,
            reverseOrder: true
        };
        return stepFunctions.getExecutionHistory(params).promise()
            .then(history => {
                //console.log(JSON.stringify(history.events, null, 3));
                _.merge(timeoutActivity, _.filter(history.events, { "type": "ActivityTimedOut" }));
                _.merge(startedActivity, _.filter(history.events, { "type": "ActivityStarted" }));
                _.merge(succeededActivity, _.filter(history.events, { "type": "ActivitySucceeded" }));
            });
    };

    const sequential = require('promise-sequential-throttle');

    await sequential.all(executions.executions, getExecutionHistory, 2)
        .then(() =>
            console.log('All promise finished in sequence'))
        .then(() => {
            console.log('Timeout Activities');
            //console.log(JSON.stringify(startedActivity, null, 3));
            console.log(`${startedActivity.length} activity started`);
            console.log(`${succeededActivity.length} activity succeeded`);
            console.log(`${timeoutActivity.length} activity timeout`);
            console.log(JSON.stringify(timeoutActivity, null, 3));
        })
        .catch(err => {
            console.log(err);
        });

    console.log();
}

try {
    main();
} catch (error) {
    console.log(JSON.stringify(error, null, 3));
}
