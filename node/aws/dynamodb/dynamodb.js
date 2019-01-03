const AWS = require('aws-sdk');
const keys = require('../../keys.json');

AWS.config.update({
    accessKeyId: keys.AWS.dev.AccessKeyId,
    secretAccessKey: keys.AWS.dev.SecretAccessKey,
    region: keys.AWS.dev.region
});

const dynamodb = new AWS.DynamoDB();

/* const params = {
    TableName: 'Movies',
    KeySchema: [
        { AttributeName: 'year', KeyType: 'HASH' },  //Partition key
        { AttributeName: 'title', KeyType: 'RANGE' }  //Sort key
    ],
    AttributeDefinitions: [
        { AttributeName: 'year', AttributeType: 'N' },
        { AttributeName: 'title', AttributeType: 'S' }
    ],
    ProvisionedThroughput: {
        ReadCapacityUnits: 10,
        WriteCapacityUnits: 10
    }
};

dynamodb.createTable(params, function (err, data) {
    if (err) {
        console.error('Unable to create table. Error JSON:', JSON.stringify(err, null, 2));
    } else {
        console.log('Created table. Table description JSON:', JSON.stringify(data, null, 2));
    }
}); */


const docClient = new AWS.DynamoDB.DocumentClient();
const table = 'Movies';

const year = 2002;
const title = 'Fifth Element';

const params = {
    TableName: table,
    Key: {
        year,
        title
    }
};

docClient.get(params)
    .promise()
    .then((data) => {
        console.log('GetItem succeeded:', JSON.stringify(data, null, 2));
    })
    .catch((err) => {
        console.error('Unable to read item. Error JSON:', JSON.stringify(err, null, 2));
    }); 

    /*
const params = {
    TableName: table,
    Key: {
        year,
        title
    }
};

docClient.delete(params)
    .promise()
    .then((data) => {
        console.log('DeleteItem succeeded:', JSON.stringify(data, null, 2));
    })
    .catch((err) => {
        console.error('Unable to delete item. Error JSON:', JSON.stringify(err, null, 2));
    }); 
    */