const AWS = require('aws-sdk');
const keys = require('../keys.json');
const moment = require('moment');
const aws = new AWS.SWF({
    accessKeyId: keys.AWS.dev.AccessKeyId,
    secretAccessKey: keys.AWS.dev.SecretAccessKey,
    region: keys.AWS.dev.region
});


/* const x = aws.countClosedWorkflowExecutions(params,
    function (err, res) { 
        console.log(res);
    }
); */

/* const x = aws.countOpenWorkflowExecutions(params,
    function (err, res) { 
        console.log(res);
    }
); */

const params2 = {
    domain: 'service-video-encoder-dev-v2',
    taskList: { /* required */
        name: 'captionWorkflowTaskList'
    }
};

/* aws.countPendingActivityTasks(params2,
    function (err, res) { 
        console.log(res);
    }
); */

/* aws.countPendingDecisionTasks(params2,
    function (err, res) { 
        console.log(res);
    }
); */

const { forEachPromise } = require('../promise/forEachPromise');

const domain = 'service-video-encoder-dev-v2';

const params = {
    domain,
    startTimeFilter: {
        oldestDate: moment().subtract(365, 'days').toDate()
    },
};

function killAllSwfExecutions() {
    console.log('----------');
    return aws.listOpenWorkflowExecutions(params)
        .promise()
        .then(res => 
            forEachPromise(res.executionInfos, (data) => {
                const paramInner = {
                    domain: 'service-video-encoder-dev-v2',
                    workflowId: data.execution.workflowId,
                    childPolicy: 'TERMINATE'
                };
                return aws
                    .terminateWorkflowExecution(paramInner)
                    .promise()
                    .catch(err => {
                        console.log(err);
                    });
            }, 10)
            .then(() => {
                if (res.nextPageToken) {
                    params.nextPageToken = res.nextPageToken;
                    killAllSwfExecutions();
                }
            })
        );
}

killAllSwfExecutions()
    .then(() => {
        console.log('Killing Done');
    });

console.log();
