const AWS = require('aws-sdk');
const keys = require('../keys.json');
const moment = require('moment');
const aws = new AWS.SWF({
    accessKeyId: keys.AWS.dev.AccessKeyId,
    secretAccessKey: keys.AWS.dev.SecretAccessKey,
    region: keys.AWS.dev.region
});

const params = {
    domain: 'service-video-encoder-dev-v2',
    startTimeFilter: {
        oldestDate: moment().subtract(1, 'days').toDate()
    },
};

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

aws.listOpenWorkflowExecutions(params,
    function (err, res) { 
        res.executionInfos.forEach((e) => {
            const paramInner = {
                domain: 'service-video-encoder-dev-v2',
                workflowId: e.execution.workflowId
            };
            aws.terminateWorkflowExecution(paramInner, (err2, res2) => {
                console.log();
            });
        });
        console.log(res);
    }
);

console.log();
