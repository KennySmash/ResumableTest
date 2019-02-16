"use strict";
var fs = require('fs'),
config = require('./config'),
express = require('express'),
AWS = require('aws-sdk'),
cors = require('cors'),
io = require('socket.io')();

require('dotenv').config();

var tally = require('./lib/tallyBucket');

var S3 = new AWS.S3({
  accessKeyId: config.aws.accessKeyId,
  secretAccessKey: config.aws.secretAccessKey
});

var app = express();

var queue = [];
var bucketSize = 0;

app.use(cors({
  origin: true,
  optionsSuccessStatus: 200
}));
app.use(express.static(__dirname + '/cloudfront/dist'));

app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('X-XSS-Protection' , 0 );
  next();
});

app.get('/bucketStatus', function(req, res){
  console.log('Getting Amazon Details', config.aws);
  S3.listObjectsV2({'Bucket' : config.aws.bucket}, function(err, data){
    if (err){
      console.log('amazon error', err);
    } else {
      tally(data, bucketSize, function(){
        res.send({
          name: config.aws.bucket,
          allowedUsage: config.aws.usageLimit,
          currentUsage: bucketSize
        });
      });
    }
  });
  /*
    bucketStats: {
        name: '',
        allowedUsage: 0,
        currentUsage: 0,
      },
  */
});

io.on('connection', function(socket){
  console.log('__SOCKET__ A Client Connected', socket.id);

  // Sockets

  //  'start_upload' - passed the metadata and first chunk to the server
  //                   which ques it up and returns a started event


})


app.listen(config.port, function() {
  console.log(`Server listening on port ${config.port}`);
});

io.listen(5050);