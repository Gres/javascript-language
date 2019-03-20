const AWS = require('aws-sdk');
const keys = require('../../keys.json');

AWS.config.update({
    accessKeyId: keys.dev.AccessKeyId,
    secretAccessKey: keys.dev.SecretAccessKey,
    region: keys.dev.region
});

const stepFunctions = new AWS.StepFunctions();

const workerName = 'asdfasdfasd';

function getGreeting(who) {
    return `Hello ${who}`;
}

async function getActivityTask() {
    console.log('------ getActivityTask -------');
    const params = {
        activityArn: 'arn:aws:states:us-west-2:881405140166:activity:step-function-activity-one',
        workerName
    };
    /*
    stepFunctions.getActivityTask(params, (err, result) => {
        console.log(JSON.stringify(result, null, 3));
        const { input, taskToken } = result;
    });
    */

    /*
    */
    const result = await stepFunctions.getActivityTask(params).promise();
    const { input, taskToken } = result;
    console.log(JSON.stringify(input, null, 3));
    console.log(JSON.stringify(taskToken, null, 3));
    return result;
}

async function listActivities() {
    const params = {
        maxResults: 0,
    };
    const result = await stepFunctions.listActivities(params).promise();
    console.log(JSON.stringify(result, null, 3));
}

async function describeActivity() {
    const params = {
        activityArn: 'arn:aws:states:us-west-2:881405140166:activity:step-function-activity-one',
    };
    const result = await stepFunctions.describeActivity(params).promise();
    console.log(JSON.stringify(result, null, 3));
}

async function listExecutions(statusFilter) {
    const params = {
        stateMachineArn: 'arn:aws:states:us-west-2:881405140166:stateMachine:Hello_World',
        maxResults: 0,
    };
    if (statusFilter) {
        params.statusFilter = statusFilter;
    }
    const result = await stepFunctions.listExecutions(params).promise();
    console.log(JSON.stringify(result, null, 3));
    return result;
}

async function startExecution() {
    const params = {
        stateMachineArn: 'arn:aws:states:us-west-2:881405140166:stateMachine:Hello_World'
    };
    const result = await stepFunctions.startExecution(params).promise();
    console.log(JSON.stringify(result, null, 3));
}

async function stopExecution(executionArn) {
    var params = {
        executionArn
    };
    const data = await stepFunctions.stopExecution(params)
        .promise();
    return data;
}

async function stopAllExecution() {
    const executions = await listExecutions('RUNNING');
    for (execution of executions.executions) {
        await stopExecution(execution.executionArn);
    }
    console.log();
}

async function sendTaskSuccess(output, taskToken) {
    var params = {
        output,
        taskToken 
    };
    const data = await stepFunctions.sendTaskSuccess(params)
        .promise();
    console.log('--- sendTaskSuccess ---');
    console.log(JSON.stringify(data, null, 3));
    return data;
}

async function main() {
    //await getActivityTask();
    //await listActivities();
    //await describeActivity();
    //await listExecutions();
    await stopAllExecution();
    /*
    await startExecution();
    const getActivityTaskResult = await getActivityTask();
    const { input, taskToken } = getActivityTaskResult;
    await sendTaskSuccess(JSON.stringify({ result: 'Hello World Activity' }), taskToken);
    console.log();
    */
}

try {
    main();
} catch (error) {
    console.log();
}

/*
            if (getActivityTaskResult.getTaskToken() != null) {
                try {
                    JsonNode json = Jackson.jsonNodeOf(getActivityTaskResult.getInput());
                    String greetingResult =
                            greeterActivities.getGreeting(json.get("who").textValue());
                    client.sendTaskSuccess(
                            new SendTaskSuccessRequest().withOutput(
                                    greetingResult).withTaskToken(getActivityTaskResult.getTaskToken()));
                } catch (Exception e) {
                    client.sendTaskFailure(new SendTaskFailureRequest().withTaskToken(
                            getActivityTaskResult.getTaskToken()));
                }
            } else {
                Thread.sleep(1000);
            }
        }
    }
}

stepFunctions.getExecutionHistory(params,
    function (err, res) { 
        console.log(JSON.stringify(res, null, 3));
    }
);
*/

const AWS = require(aws - sdk);
const stepFunctions = new AWS.StepFunctions();
const getActivityParams = {
    activityArn: 'arn:aws:states:us-east-1:123456789012:activity:get-greeting',
    workerName: 'test-worker'
};
stepFunctions
    .getActivityTask(getActivityParams)
    .promise()
    .then(activityTask => {
        const { input, taskToken } = activityTask;
        const taskSuccessParams = {
            taskToken
        };
        return stepFunctions
            .sendTaskSuccess(getActivityParams)
            .promise();
    });