"use strict";
require('dotenv').config();
var fs = require('fs'),
config = require('./config'),
express = require('express'),
AWS = require('aws-sdk'),
cors = require('cors'),
io = require('socket.io')();

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
});

io.on('connection', function(socket){
  console.log('__SOCKET__ A Client Connected', socket.id);

  // Sockets

  /* 'upload_start' 
     passes the metadata to the server and sets up the que, once done requests
     the first chunk from the client
  */                   

  /*  'upload_chunk' - 
    passes a chunk which contains the data and file meta info, 
    the server stores it and checks if its the last chunk or if 
    the stream will pause, either way send the chunk finished evt,
    and maybe send the request for the next chunk
  */

  /* 'upload_resume'
    gets passed a file id and if its in the transfer queue then request
    the next chunk in the series, if not then silent error and ignore.
  */


})


app.listen(config.port, function() {
  console.log(`Server listening on port ${config.port}`);
});

io.listen(5050, () => console.log('Socket Server started on 5050'));