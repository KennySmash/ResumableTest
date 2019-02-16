'use strict';

var config = {
  aws: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    bucket: process.env.BUCKET_NAME,
    usageLimit: parseInt(process.env.USAGE_LIMIT, 10)
  },
  port: process.env.PORT || 3000
};

module.exports = config;
