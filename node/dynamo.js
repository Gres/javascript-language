const AWS = require('aws-sdk');
const config = require('./keys.json');
const Q = require('q');
const randomWords = require('random-words');

AWS.config.update({
    accessKeyId: config.AWS.dev.AccessKeyId,
    secretAccessKey: config.AWS.dev.SecretAccessKey,
    region: 'us-west-2'
});

const dynamodb = new AWS.DynamoDB();

function createTable() {

    var params = {
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
        TableName: "ewang-test"
    };

    Q.ninvoke(dynamodb, 'createTable', params)
        .then(function (data) {
            console.log(data);
        })
        .catch(function (err) {
            console.log(err);
        });
}

function putItems() {
    const batch = randomWords({ exactly: 1, join: ' ' });
    const promiseStack = [];
    for (i = 0; i < 10; ++i) {
        const params = {
            Item: {
                "AlbumTitle": {
                    S: randomWords({ exactly: 1, join: ' ' })
                },
                "Artist": {
                    S: randomWords({ exactly: 2, join: ' ' })
                },
                "SongTitle": {
                    S: randomWords({ exactly: 3, join: ' ' })
                },
                "Batch": {
                    S: batch
                },
            },
            ReturnConsumedCapacity: "TOTAL",
            TableName: "ewang-test"
        };
        promiseStack.push(
            Q.ninvoke(dynamodb, 'putItem', params)
        );
        /*
        promiseStack.push(
            Q.Promise(function(resolve, reject){
                setTimeout(function(){
                    resolve();
                }, 1000);
            })
        );
        */
    }
    promiseStack.reduce(function (sum, item) {
        return sum.then(function () {
            return item;
        });
    }, Q.resolve())
        .catch(function (err) {
            console.log();
        });
}

function batchWriteItems() {

    const batch = randomWords({ exactly: 1, join: ' ' });
    const requestList = [];
    for (i = 0; i < 10; ++i) {
        const item = {
            PutRequest: {
                Item: {
                    "AlbumTitle": {
                        S: randomWords({ exactly: 1, join: ' ' })
                    },
                    "Artist": {
                        S: randomWords({ exactly: 1, join: ' ' })
                    },
                    "SongTitle": {
                        S: randomWords({ exactly: 1, join: ' ' })
                    },
                    "Batch": {
                        S: batch
                    },
                }
            }
        };
        requestList.push(item);
    }

    var params = {
        RequestItems: {
            "ewang-test": requestList
        }
    };

    /*
    const batch = randomWords({ exactly: 1, join: ' ' });
    for (i = 0; i < 10; ++i) {
        const item = {
            PutRequest: {
                Item: {
                    "AlbumTitle": {
                        S: "Somewhat Famous"
                    },
                    "Artist": {
                        S: "No One You Know"
                    },
                    "SongTitle": {
                        S: "Call Me Today"
                    }
                }
            }
        }; 
        params.RequestItems["ewang-test"].push(item);
    }
    */
    dynamodb.batchWriteItem(params, function (err, data) {
        console.log();
    })
}

function queryItem() {
    const param = {
        Key: {
            "Artist": {
                S: "minute"
            },
            "SongTitle": {
                S: "source"
            }
        },
        AttributesToGet: [
            "Artist",
            "SongTitle"
        ],
        TableName: "ewang-test"
    };
    dynamodb.getItem(param, function(err, data){
        if (err) console.log(err, err.stack); // an error occurred
        else     console.log(data);           // successful response    
    });
}

//createTable();
//putItems();
//batchWriteItems();
//queryItem();
glocalSecondaryIndex();
