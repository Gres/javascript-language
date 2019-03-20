const { exec } = require('../base');

let params = {
    ExpressionAttributeNames: {
        "#AT": "AlbumTitle",
        "#ST": "SongTitle"
    },
    ExpressionAttributeValues: {
        ":a": {
            S: "Artist Foo"
        }
    },
    FilterExpression: "Artist = :a",
    ProjectionExpression: "#ST, #AT",
    TableName: "Music"
};

params = {
    ScanFilter: {
        "SongTitle": {
            ComparisonOperator: "EQ",
            AttributeValueList: [
                {
                    S: "Song 0"
                }
            ]
        }
    },
    TableName: "Music"
};

params = {
    ScanFilter: {
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
    TableName: "Music"
};

params = {
    ScanFilter: {
        "Artist": {
            ComparisonOperator: "EQ",
            AttributeValueList: [
                {
                    S: "Artist Foo"
                }
            ]
        },
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
    },
    TableName: "Music"
};

const method = 'scan';

exec(method, params);
