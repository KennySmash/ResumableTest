'use strict';
const config = require('../config');
const fs = require('fs');
const AWS = require('aws-sdk');
const path = require('path');
const Promise = require('bluebird');

module.exports = function(localFileName, remoteFilePath){
    let uploadPromise = new Promise(function(resolve, reject){
        
        let link = new AWS.S3({params: 
            {
                Bucket: config.aws.bucket, 
                timeout: 6000000, 
                accessKeyId: config.aws.accessKeyId,
                secretAccessKey: config.aws.secretAccessKey,
                signatureVersion: 'v4'
            }
        });
    
        fs.readFile('./.temp/'+localFileName, function(err, fileData){
        
            link.upload({
                Bucket: config.aws.bucket, // bucket name on which file to be uploaded
                Key: remoteFilePath + localFileName,  // file name on s3
                ContentType: 'binary', // type of file
                Body: fileData, // base-64 file stream
                ACL: 'public-read'  // public read access
            }, function(err, resp){
                if (err) {  // if there is any issue
                    console.error('failed file upload to S3:: ', err)
                    reject(err);
                }
                console.log('response from S3: ', resp);
                resolve({response : resp,localFile: localFileName});
            })
        })
    })

    return uploadPromise;

}   
