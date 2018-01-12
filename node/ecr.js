const AWS = require('aws-sdk');
const config = require('./keys.json');
const NODE_ENV = process.env.NODE_ENV || 'dev';
const _ = require('lodash');
const Q = require('q');

AWS.config.update({
    accessKeyId: config.AWS[NODE_ENV].AccessKeyId,
    secretAccessKey: config.AWS[NODE_ENV].SecretAccessKey, 
    region: config.AWS[NODE_ENV].region
});

function validateEcrRepo(containerInstance, version) {
    const ecr = new AWS.ECR();
    const imageParam = {
        repositoryName: containerInstance,
        /*
        imageIds: [
            {
              imageTag: '1.0.4-1273'
            }
          ],
          */
    };
    return Q.ninvoke(ecr, 'describeImages', imageParam)
        .then(function (data) {
            return Q.Promise(function (resolve, reject) {
                const matchedImage = _.find(data.imageDetails, function (img) {
                    return _.indexOf(img.imageTags, version) !== -1;
                });
                if (matchedImage) {
                    resolve(matchedImage);
                } else {
                    const e = new RequestError('Invalid version parameter. Docker image doesn\'t exist in Elastic Container Registry', 
                    'INVALID_PARAMETER_VALUE');
                    reject(e);
                }
            });
        })
        .catch(function (err) {
            if (err && err.code === 'RepositoryNotFoundException') {
                throw new RequestError('Invalid containerInstance parameter. Docker image doesn\'t exist in Elastic Container Registry',
                'INVALID_PARAMETER_VALUE');
            } else {
                throw err;
            }
        });
}

const containerInstance = 'task-report-processor';
const version = '';

validateEcrRepo(containerInstance, version)
.then(function(){
    console.log();
});