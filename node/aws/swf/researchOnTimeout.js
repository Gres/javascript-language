const AWS = require('aws-sdk');
const moment = require('moment');
const uuidLib = require('uuid');
const keys = require('../../keys.json');
const swf = new AWS.SWF({
    accessKeyId: keys.AWS.dev.AccessKeyId,
    secretAccessKey: keys.AWS.dev.SecretAccessKey,
    region: keys.AWS.dev.region
});

const domain = 'service-video-encoder-dev-v3';

function startWorkflowAsync(workflowId, options, input) {
    return new Promise((resolve, reject) => {
        const params = {
            domain,
            workflowId,
            workflowType: {
                name: 'EncodeAll',
                version: '1.0' 
            },
            childPolicy: 'TERMINATE',
            taskStartToCloseTimeout: '10',
            executionStartToCloseTimeout: '10', 
            taskList: {
                name: 'encodeWorkflowTaskList'
            }
        };

        swf.startWorkflowExecution(params)
            .promise()
            .then(res => {
                console.log(res);
                const params2 = {
                    domain,
                    startTimeFilter: {
                        oldestDate: moment().subtract(365, 'days').toDate()
                    },
                };
                return swf.listOpenWorkflowExecutions(params2)
                .promise();
            })
            .then(res => {
                console.log(res);
                const params3 = {
                    domain,
                    taskList: {
                        name: 'encodeWorkflowTaskList'
                    }
                };
                return new Promise((resolve, reject) => {
                    setTimeout(() => {
                        return swf.pollForDecisionTask(params3)
                            .promise()
                            .then(res2 => {
                                resolve(res2);
                            })
                            .catch(err => {
                                resolve(err);
                            });
                    }, 15 * 1000);
                });
            })
            .then(data => {
                this.data = data;
            })
            .catch(err => {
                console.log(err);
            });
    });
}

const createId = function (suffix) {
    return `${uuidLib.v4().replace(/-/g, '')}-${suffix}`;
};

const workflowId = createId('abc'); 
const options =
    {
        priority: 0,
        workflowTimeoutSeconds: 86400
    };
const input = {};

startWorkflowAsync(workflowId, options, input)
    .then(() => {
        console.log('Terminator Task Accomplished');
    });

console.log();
