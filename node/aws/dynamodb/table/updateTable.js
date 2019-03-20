const { exec } = require('../base');

const params = {
    AttributeDefinitions: [
        {
            AttributeName: "Artist",
            AttributeType: "S"
        },
        {
            AttributeName: "SongTitle",
            AttributeType: "S"
        },
        {
            AttributeName: "AlbumTitle",
            AttributeType: "S"
        }
    ],
    ProvisionedThroughput: {
        ReadCapacityUnits: 5,
        WriteCapacityUnits: 5
    },
    TableName: "Music",
};

const params2 = {
    ProvisionedThroughput: {
        ReadCapacityUnits: 5,
        WriteCapacityUnits: 5
    },
    TableName: "Music",
    GlobalSecondaryIndexUpdates: [
        {
            Create: {
                IndexName: 'album-title', /* required */
                KeySchema: [ /* required */
                    {
                        AttributeName: 'Artist', /* required */
                        KeyType: "HASH" /* required */
                    },
                    {
                        AttributeName: 'AlbumTitle', /* required */
                        KeyType: "RANGE" /* required */
                    },
                    /* more items */
                ],
                Projection: { /* required */
                    ProjectionType: "ALL" 
                },
                ProvisionedThroughput: {
                    ReadCapacityUnits: 5, /* required */
                    WriteCapacityUnits: 5 /* required */
                }
            }
        }
    ]
};

const method = 'updateTable';

exec(method, params);
