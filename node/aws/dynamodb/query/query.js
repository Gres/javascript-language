const { exec } = require('../base');

const param0 = {
    ExpressionAttributeValues: {
        ":v1": {
            S: "Artist Foo"
        }
    },
    KeyConditionExpression: "Artist = :v1",
    ProjectionExpression: "SongTitle",
    TableName: "Music"
};

const param1 = {
    KeyConditions: {
        "Artist": {
            ComparisonOperator: "EQ",
            AttributeValueList: [
                {
                    S: "Artist Foo"
                }
            ]
        },
        "SongTitle": {
            ComparisonOperator: "BETWEEN",
            AttributeValueList: [
                {
                    S: "Song 3"
                },
                {
                    S: "Song 7"
                }
            ]
        }
    },
    ProjectionExpression: "SongTitle",
    TableName: "Music"
};

const param2 = {
    KeyConditions: {
        "Artist": {
            ComparisonOperator: "EQ",
            AttributeValueList: [
                {
                    S: "Artist Foo"
                }
            ]
        },
        "SongTitle": {
            ComparisonOperator: "BETWEEN",
            AttributeValueList: [
                {
                    S: "Song 3"
                },
                {
                    S: "Song 7"
                }
            ]
        },
        /*
        {
            "message": "Conditions can be of length 1 or 2 only",
            "code": "ValidationException",
            "time": "2019-01-08T01:05:41.228Z",
            "requestId": "2ASPTUJLNDKEA7RT67A3613L2RVV4KQNSO5AEMVJF66Q9ASUAAJG",
            "statusCode": 400,
            "retryable": false,
            "retryDelay": 17.7914294535644
        }
        "AlbumTitle": {
            ComparisonOperator: "BETWEEN",
            AttributeValueList: [
                {
                    S: "Title Foo"
                },
                {
                    S: "Title Foo"
                }
            ]
        }
        */
    },
    ProjectionExpression: "SongTitle",
    TableName: "Music"
};

const param3 = {
    KeyConditions: {
        "Artist": {
            ComparisonOperator: "EQ",
            AttributeValueList: [
                {
                    S: "Artist Bar"
                }
            ]
        },
        /* 
        {
   "message": "Query condition missed key schema element: SongTitle",
   "code": "ValidationException",
   "time": "2019-01-08T01:10:15.163Z",
   "requestId": "FT40470GBO2K9BMF8STU78G3SFVV4KQNSO5AEMVJF66Q9ASUAAJG",
   "statusCode": 400,
   "retryable": false,
   "retryDelay": 28.385119246903844
        }
        */
        "AlbumTitle": {
            ComparisonOperator: "BETWEEN",
            AttributeValueList: [
                {
                    S: "Song Bar 2"
                },
                {
                    S: "Song Bar 5"
                }
            ]
        }
    },
    ProjectionExpression: "AlbumTitle",
    TableName: "Music"
};

const params = [
    param0,
    param1,
    param2,
    param3,
];

const method = 'query';

exec(method, params[3]);
