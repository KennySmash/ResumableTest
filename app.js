"use strict";

var fs = require('fs'),
    express = require('express'),
    AWS = require('aws-sdk'),
    config = require('./config'),
    cors = require('cors'),
    siofu = require('socketio-file-upload');

    var S3 = new AWS.S3({
      accessKeyId: config.aws.accessKeyId,
      secretAccessKey: config.aws.secretAccessKey
    });

var app = express();
var socket = express().use(siofu.router);

var queue = {
  currentQueue : []
};

app.use(express.static(__dirname + '/cloudfront/dist'));

app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('X-XSS-Protection' , 0 );
  next();
});

app.get('/bucketStatus', function(req, res){
  console.log('Recieved a ping on /bucketStatus');
  res.send( 
   { 
    'allowedUsage': 2010001,
    'currentUsage': 150000,
    'fileCount': 100,
    'bucketName': "S3_TEST_BUCKET"
   }
  );
});

app.get('/queueStatus', function(req, res, cb){``

});

app.post('/upload', function(req, res, cb){
  console.log(req);
  
});

app.listen(config.port, function() {
  console.log(`Server listening on port ${config.port}`);
});

socket.listen(5050);
