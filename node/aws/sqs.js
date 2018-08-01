const AWS = require('aws-sdk');
const keys = require('../keys.json');

AWS.config.update({
    accessKeyId: keys.AWS.dev.AccessKeyId,
    secretAccessKey: keys.AWS.dev.SecretAccessKey,
    region: keys.AWS.dev.region
});

const sqs = new AWS.SQS();

/* 
const params = {
    DelaySeconds: 1,
    MessageBody: 'Information about current NY Times fiction bestseller for week of 12/11/2016.',
    QueueUrl: 'https://sqs.us-east-1.amazonaws.com/775101116967/dev-ewang-test'
};

sqs.sendMessage(params, function (err, data) {
    if (err) {
        console.log('Error', err);
    } else {
        console.log('Success', data.MessageId);
    }
});
 */

const QueueUrl = 'https://sqs.us-east-1.amazonaws.com/775101116967/dev-ewang-test';

const params = {
    MaxNumberOfMessages: 10,
    QueueUrl
};

sqs.receiveMessage(params, function (err, data) {
    if (err) {
        console.log('Receive Error', err);
    } else if (data.Messages) {
        const deleteParams = {
            QueueUrl,
            ReceiptHandle: data.Messages[0].ReceiptHandle
        };
        sqs.deleteMessage(deleteParams, function (err, data) {
            if (err) {
                console.log('Delete Error', err);
            } else {
                console.log('Message Deleted', data);
            }
        });
    }
});
