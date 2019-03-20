
const AWS = require('aws-sdk');
AWS.config.region = 'us-east-1';
const keys = require('../../keys.json');

async function main() {
    const credentials = new AWS.SharedIniFileCredentials({ profile: 'cbtn-lx-qa' });
    AWS.config.credentials = credentials;

    let source = 'service-pricing';
    const kms = new AWS.KMS({ region: 'us-east-1' });
    keyValue = "AQICAHgZuPzh5UDIrkDR1avgvTYPV04OtCNR2e0G3bjP4n9mvwGW93D8N5UW4jwCFRGwwgnAAAAAhzCBhAYJKoZIhvcNAQcGoHcwdQIBADBwBgkqhkiG9w0BBwEwHgYJYIZIAWUDBAEuMBEEDIWaYUGxQYwG92hUKwIBEIBDGBEU8itklwFL6zGQwXAhDNUa+9N1Hm18Cj3hy9NBmGb4im52fay+TYm//QCtbukEQETAd3eHw55w0RtWiwh0N92GeA==";
    const decryptParams = {
        CiphertextBlob: Buffer.from(keyValue, 'base64'),
        EncryptionContext: {
            source
        }
    };
    const data = await kms.decrypt(decryptParams).promise();
    console.log(JSON.stringify(data, null, 3));
    console.log();
}

try {
    main();
} catch (error) {
    console.log(JSON.stringify(error, null, 3)); 
}