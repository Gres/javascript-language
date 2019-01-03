const AWS = require('aws-sdk');
const keys = require('../../../keys.json');

AWS.config.update({
    accessKeyId: keys.AWS.dev.AccessKeyId,
    secretAccessKey: keys.AWS.dev.SecretAccessKey,
    region: keys.AWS.dev.region
});

const dynamodb = new AWS.DynamoDB();

const params = {
    AttributeDefinitions: [
        {
            AttributeName: "Artist",
            AttributeType: "S"
        },
        {
            AttributeName: "SongTitle",
            AttributeType: "S"
        }
    ],
    KeySchema: [
        {
            AttributeName: "Artist",
            KeyType: "HASH"
        },
        {
            AttributeName: "SongTitle",
            KeyType: "RANGE"
        }
    ],
    ProvisionedThroughput: {
        ReadCapacityUnits: 5,
        WriteCapacityUnits: 5
    },
    TableName: "Music"
};

dynamodb.createTable(params)
    .promise()
    .then(data => {
        console.log(JSON.stringify(data, null, 3));
        console.log('Created table');
    })
    .catch(err => {
        console.log(JSON.stringify(err, null, 3));
        console.error('Unable to create table');
    });
