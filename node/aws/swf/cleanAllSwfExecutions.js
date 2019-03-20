const moment = require('moment');
const AWS = require('aws-sdk');
const keys = require('../../keys.json');
const _ = require('lodash');
const swf = new AWS.SWF({
    accessKeyId: keys.AWS.dev.AccessKeyId,
    secretAccessKey: keys.AWS.dev.SecretAccessKey,
    region: keys.AWS.dev.region
});

const sequential = require('promise-sequential-throttle');
const domain = 'service-video-encoder-dev-v3';

const params = {
    domain,
    startTimeFilter: {
        oldestDate: moment().subtract(365, 'days').toDate()
    },
};

function terminatorTask() {
    console.log('----------');
    return swf.listOpenWorkflowExecutions(params)
        .promise()
        .then(res =>
            sequential.all(res.executionInfos, (data) => {
                const paramInner = {
                    domain,
                    workflowId: data.execution.workflowId,
                    childPolicy: 'TERMINATE'
                };
                return swf
                    .terminateWorkflowExecution(paramInner)
                    .promise()
                    .catch(err => {
                        console.log(err);
                    });
            }, 5)
                .then(() => {
                    if (res.nextPageToken) {
                        params.nextPageToken = res.nextPageToken;
                        return terminatorTask();
                    }
                })
        )
        .catch(err => {
            console.log(err);
        });
}

terminatorTask()
    .then(() => {
        console.log('Terminator Task Accomplished');
    });

console.log();
