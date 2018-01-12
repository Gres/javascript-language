const AWS = require('aws-sdk');
const config = require('./keys.json');
const NODE_ENV = process.env.NODE_ENV || 'dev';
const _ = require('lodash');

AWS.config.update({
    accessKeyId: config.AWS[NODE_ENV].AccessKeyId,
    secretAccessKey: config.AWS[NODE_ENV].SecretAccessKey, 
    region: config.AWS[NODE_ENV].region
});

const ec2 = new AWS.EC2();
const params = {
    //IncludeAllInstances: true
    /*
    InstanceIds: [
        'i-0a02998e583708b3d'
    ]
    */
};

/*
ec2.describeInstanceStatus(params, function(err, data){
    if (err) 
        console.log(err, err.stack); // an error occurred
    else     
        console.log(JSON.stringify(data, null, 3));           // successful response
});
*/

ec2.describeInstanceStatus(params, function(err, data){
    console.log();
});

ec2.describeInstances(params, function(err, data){
    if (err) 
        console.log(err, err.stack); // an error occurred


    const ec2List = data.Reservations;
    const list = _.filter(ec2List, function(o){
        const tags = o.Instances[0].Tags;
        const env = _.find(tags, {Key: 'environment'});
        if(env && env.Value === NODE_ENV){
            return true;
        }else{
            return false;
        }
    })
    const ec2InstanceList = list.sort(function compare(a, b){
        var dateA = a.Instances[0].LaunchTime; 
        var dateB = b.Instances[0].LaunchTime; 
        return new Date(dateB) - new Date(dateA);
    })
    const launchtimeList = _.map(ec2InstanceList, function(o){
        const timeStr = o.Instances[0].LaunchTime;
        const d = new Date(timeStr);
        return d;
    }) 
    const tagsList = _.map(ec2InstanceList, function(o){
        return o.Instances[0].Tags;
    }) 
    const nameList = _.map(tagsList, function(l){
        return _.find(l, ['Key', 'Name']); 
    })
    const taskIdList = _.map(tagsList, function(l){
        return _.find(l, ['Key', 'taskId']); 
    })
    console.log();
});