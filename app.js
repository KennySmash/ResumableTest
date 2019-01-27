"use strict";

var fs = require('fs'),
    express = require('express'),
    multipart = require('connect-multiparty'),
    WebSocket = require('ws');

var config = require('./config'),
    checkFile = require('./lib/checkFile'),
    createFile = require('./lib/createFile'),
    mergeFiles = require('./lib/mergeFiles'),
    listFiles = require('./lib/listFiles'),
    getChunkFilename = require('./lib/getChunkFilename');

var app = express();
var wss = new WebSocket.Server({
  port: 8090,
  perMessageDeflate: {
    zlibDeflateOptions: {
      // See zlib defaults.
      chunkSize: 1024,
      memLevel: 7,
      level: 3
    },
    zlibInflateOptions: {
      chunkSize: 10 * 1024
    },
    // Other options settable:
    clientNoContextTakeover: true, // Defaults to negotiated value.
    serverNoContextTakeover: true, // Defaults to negotiated value.
    serverMaxWindowBits: 10, // Defaults to negotiated value.
    // Below options specified as default values.
    concurrencyLimit: 10, // Limits zlib concurrency for perf.
    threshold: 1024 // Size (in bytes) below which messages
    // should not be compressed.
  }
})

app.use(multipart());
app.use(express.static(__dirname + '/cloudfront/dist'));

app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  next();
});

app.get('/resumable', function(req, res) {
  var params = req.query;

  var folder = params.path,
      filename = params.resumableFilename,
      filetype = params.resumableType,
      chunkSize = parseInt(params.resumableChunkSize),
      totalSize = parseInt(params.resumableTotalSize),
      chunkNumber = parseInt(params.resumableChunkNumber),
      numberOfChunks = Math.max(Math.floor(totalSize/(chunkSize*1.0)), 1);

  var chunkFilename = getChunkFilename(filename, folder, chunkNumber);

  checkFile(chunkFilename)
  .then(function(filename) {
    return mergeFiles(filename, filetype, numberOfChunks);
  })
  .then(function(filename) {
    if(typeof(filename)!='undefined') {
      res.status(200).send(`https://s3.amazonaws.com/${config.s3.Bucket}/${filename}`);
    } else {
      res.status(204).send(error);
    }
  })
  .catch(function(error) {
    res.status(500).send(error);
  });
});

app.get('/bucketStatus', function(req, res){
  res.send({'DidItWork': "maybe"});
});

app.get('/buildTheme', function(req, res){

})

app.post('/resumable', function(req, res) {

  var params = req.query;

  var folder = params.path,
      filename = params.resumableFilename,
      filetype = params.resumableType,
      chunkSize = parseInt(params.resumableChunkSize),
      totalSize = parseInt(params.resumableTotalSize),
      chunkNumber = parseInt(params.resumableChunkNumber),
      numberOfChunks = Math.max(Math.floor(totalSize/(chunkSize*1.0)), 1);

  var file = req.files.file;
  var chunkFilename = getChunkFilename(filename, folder, chunkNumber);

  createFile({name: chunkFilename, type: filetype, buffer: fs.readFileSync(file.path)})
  .then(function(filename) {
    return mergeFiles(filename, filetype, numberOfChunks);
  })
  .then(function(filename) {
    res.status(200).send(`https://s3.amazonaws.com/${config.s3.Bucket}/${filename}`);
  })
  .catch(function(error) {
    res.status(500).send(error);
  });
});

app.listen(config.port, function() {
  console.log(`Server listening on port ${config.port}`);
});

wss.on('open', function open(){
  
});
