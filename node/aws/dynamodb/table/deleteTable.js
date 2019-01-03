const AWS = require('aws-sdk');
const keys = require('../../../keys.json');

AWS.config.update({
    accessKeyId: keys.AWS.dev.AccessKeyId,
    secretAccessKey: keys.AWS.dev.SecretAccessKey,
    region: keys.AWS.dev.region
});

const dynamodb = new AWS.DynamoDB();

 const params = {
    TableName: 'Music'
};

dynamodb.deleteTable(params)
    .promise()    
    .then(data => {
        console.log(JSON.stringify(data, null, 3));
        console.log('Deleted table');
    })
    .catch(err => {
        console.log(JSON.stringify(err, null, 3));
        console.error('Unable to delete table');
    });
