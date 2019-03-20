const AWS = require('aws-sdk');
const keys = require('../../../keys.json');

AWS.config.update({
    accessKeyId: keys.AWS.dev.AccessKeyId,
    secretAccessKey: keys.AWS.dev.SecretAccessKey,
    region: keys.AWS.dev.region
});

const dynamodb = new AWS.DynamoDB();

const params = {
    RequestItems: {
        "Music": {
            Keys: [
                {
                    "Artist": {
                        S: "No One You Know"
                    },
                    "SongTitle": {
                        S: "Call Me Today"
                    }
                },
                {
                    "Artist": {
                        S: "Acme Band"
                    },
                    "SongTitle": {
                        S: "Happy Day"
                    }
                },
                {
                    "Artist": {
                        S: "No One You Know"
                    },
                    "SongTitle": {
                        S: "Scared of My Shadow"
                    }
                }
            ],
            ProjectionExpression: "AlbumTitle"
        }
    }
};

const method = 'batchGetItem';

dynamodb[method](params)
    .promise()
    .then(data => {
        console.log(JSON.stringify(data, null, 3));
        console.log(`${method} done`);
    })
    .catch(err => {
        console.log(JSON.stringify(err, null, 3));
        console.error(`${method} error`);
    });
