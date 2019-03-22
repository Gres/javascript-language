
const AWS = require('aws-sdk');
const fs = require('fs');
const sts = new AWS.STS();
const credentials = new AWS.SharedIniFileCredentials({ profile: 'cbtn-lx-qa' });
AWS.config.update({
    region: 'us-east-1'
});
AWS.config.credentials = credentials;

async function assumeRole() {
    const sessionData = await sts.assumeRole(
        {
            RoleArn: 'arn:aws:iam::815809335584:role/service-task-runner-v2',
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
    await assumeRole();

    const ssm = new AWS.SSM();
    let params = {
        Name: '/regionSettings/securityGroupInternalInstancesECSId',
        WithDecryption: false
    };
    const securityGroupsParam = await ssm.getParameter(params).promise();
    const securityGroups = securityGroupsParam.Parameter.Value.split(',');

    params = {
        Name: '/regionSettings/subnetListPrivate',
        WithDecryption: false
    };
    const subnetsParam = await ssm.getParameter(params).promise();
    const subnets = subnetsParam.Parameter.Value.split(',');

    const stateMachineArn = 'arn:aws:states:us-east-1:815809335584:stateMachine:step-task-video-encoder-encodeOneSpeed';

    params = {
        cluster: 'Task-Runner-Tasks',
        taskDefinition: 'task-video-encoder',
        launchType: 'FARGATE',
        networkConfiguration: {
            awsvpcConfiguration: {
                subnets,
                securityGroups
            }
        },
        overrides: {
            containerOverrides: [
                {                                               
                    name: 'task-video-encoder-v1',
                    environment: [
                        {
                          name: 'TASK_ID',
                          value: '7004d192791947aba77893ded4185600', 
                        },
                        {
                            name: 'TASK_TYPE',
                            value: 'encoder' 
                        },
                        {
                            name: 'TASK_OPTIONS',
                            value: '' 
                        }
                    ],
                    cpu: 512,
                    memory: 1024,
                }
            ]
            //executionRoleArn: 'STRING_VALUE',
            //taskRoleArn: 'STRING_VALUE'
        }
    };

    const ecs = new AWS.ECS();

    const result = await ecs.runTask(params).promise();
    console.log(JSON.stringify(result, null, 3));

    console.log();
}
main();
