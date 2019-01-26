'use strict';

var config = {
  s3: {
    bucket: process.env.BUCKET_NAME,
    computeChecksums: true,
    
  },
  aws: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
  },
  port: process.env.PORT || 3000
};

module.exports = config;
