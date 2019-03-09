"use strict";
require('dotenv').config();
var fs = require('fs'),
config = require('./config'),
express = require('express'),
AWS = require('aws-sdk'),
cors = require('cors'),
io = require('socket.io')(),
chalk = require('chalk'),
log = require('captains-log')(),
crc32 = require('crc').crc32,
s3transfer = require('./lib/uploadToBucket'),
Promise = require('bluebird'),
util = require('util');

var tally = require('./lib/tallyBucket');

var S3 = new AWS.S3({
  accessKeyId: config.aws.accessKeyId,
  secretAccessKey: config.aws.secretAccessKey
});

var app = express();

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
  // log('Getting Amazon Details');
  S3.listObjectsV2({'Bucket' : config.aws.bucket}, function(err, data){
    if (err){
      log('amazon error', err);
    } else {
      tally(data, bucketSize, function(usage){
        res.send({
          name: config.aws.bucket,
          allowedUsage: config.aws.usageLimit * 1024 * 1024,
          currentUsage: usage 
        });
      });
    }
  });
});


var transferQ = {};
var transferCount = 0;

io.on('connection', function(socket){
  log(chalk.bgYellow('__SOCKET__ '),chalk.yellow('A Client Connected'), chalk.grey(socket.id));

  // Sockets

  /* 'upload_start' 
     passes the metadata to the server and sets up the que, once done requests
     the first chunk from the client
  */                   
  socket.on('upload_start', function(data){
    //log.info(chalk.bgBlue('  upload_start  '), data);
    // Check the filesize against the config max, return an error if its too big or wrong file type 
    if (data.size < config.maxFileSize){
      log('file size is fine', data.size,'/',config.maxFileSize);
      transferQ[data.name] = data;
      transferQ[data.name].currentChunk = 0;
      transferQ[data.name].data = {};
      transferQ[data.name].mime = data.meta.mime;
      socket.emit('upload_begin', {file_id: data.id});
      
    } else {
      log('file size is too big', data.size,'/',config.maxFileSize);
      socket.emit('file_too_big', {file_id: data.id});
    }
  });

  /*  'upload_chunk' - 
    passes a chunk which contains the data and file meta info, 
    the server stores it and checks if its the last chunk or if 
    the stream will pause, either way send the chunk finished evt,
    and maybe send the request for the next chunk
  */
  socket.on('upload_chunk', function(data){
    // log(chalk.bgBlue('  upload_chunk  ', transferQ[data.meta.name]));
    // log('chunk Inspect',util.inspect(data));
    if (data.data){
      var chunkID = data.data.chunkId;
      var thisQ = transferQ[data.meta.name];
      thisQ.data[chunkID] = data.data;
      thisQ.currentChunk++;

      
      if (data.state.paused){
        // this is to prevent the next chunk from being asked from the client
        
      } else if (thisQ.currentChunk == thisQ.chunk_count){
        // log('this file is uploaded', thisQ);
        socket.emit('upload_done', {file_id: thisQ.id});
        var fileWriter = fs.createWriteStream('./.temp/'+thisQ.name);
        var chunkArrLen = Object.keys(thisQ.data).length;
        
        for(var index=0; chunkArrLen > index; index++){  
          var buffer = Buffer.from( new Uint8Array(thisQ.data[index].data) );
          fileWriter.write(buffer);
        }
        fileWriter.end(function() {
          // log('Path is : ', chalk.red('./.temp/'+thisQ.name));
          let uploadPromise = s3transfer(thisQ.name, '10/1/');
          // log('promise', uploadPromise);
          uploadPromise.then(function(data){
            // log('emitting', data);
            socket.emit('s3_done', {data: data, meta: thisQ.meta});
            fs.unlink('./.temp/'+data.localFile, function(){
              log('Yay, ', data.localFile, 'Was Deleted after upload');
            });
          })
        });
        
        
      } else {
        socket.emit('upload_next', {file_id: data.meta.id,chunkFin: chunkID, chunk_id: transferQ[data.meta.name].currentChunk});
      }
    }

  });

  /* 'upload_resume'
    gets passed a file id and if its in the transfer queue then request
    the next chunk in the series, if not then silent error and ignore.
  */
  socket.on('upload_resume', function(data){
    //log(chalk.bgBlue('  upload_resume  ', data));
    let nextChunk = transferQ[data.name].currentChunk;
    socket.emit('upload_next', {file_id: data.file_id ,chunkFin: nextChunk-- , chunk_id: nextChunk });
  });

  /*
    'ping'
    Pongs the client to update the status  
  */
  socket.on('ping', function(){
    // log('got Pinged, Gonna Pong');
    socket.emit('pong')
  });

})


app.listen(config.port, function() {
  log(`Server listening on port ${config.port}`);
  log('Socket Server started on 5050');
});

io.listen(5050, () => log('Socket Server started on 5050'));