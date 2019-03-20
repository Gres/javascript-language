const { exec } = require('../base');

const Music = [];
for (let i = 0; i < 10; ++i) {
    Music.push(
        {
            PutRequest: {
                Item: {
                    "AlbumTitle": {
                        S: `Title Bar ${i}` 
                    },
                    "Artist": {
                        S: "Artist Bar"
                    },
                    "SongTitle": {
                        S: `Song Bar ${i}` 
                    }
                }
            }
        }
    );
}

const params = {
    RequestItems: {
        "Music": Music
    }
};

const method = 'batchWriteItem';

exec(method, params);
