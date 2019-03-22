
const AWS = require('aws-sdk');
const fs = require('fs');
const sts = new AWS.STS();
const credentials = new AWS.SharedIniFileCredentials({ profile: 'cbtn-dev' });
AWS.config.update({
    region: 'us-west-2'
});
AWS.config.credentials = credentials;

async function main() {
    const stateMachineArn = 'arn:aws:states:us-west-2:775101116967:stateMachine:step-task-video-encoder-encodeOneSpeed';

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
