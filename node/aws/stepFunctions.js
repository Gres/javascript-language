const AWS = require('aws-sdk');
const keys = require('../keys.json');

AWS.config.update({
    accessKeyId: keys.AWS.dev.AccessKeyId,
    secretAccessKey: keys.AWS.dev.SecretAccessKey,
    region: keys.AWS.dev.region
});
const stepFunctions = new AWS.StepFunctions();

const workflowId = 'xxx';

const params = {
    executionArn: workflowId
};

stepFunctions.getExecutionHistory(params,
    function (err, res) { 
        console.log(JSON.stringify(res, null, 3));
    }
);
