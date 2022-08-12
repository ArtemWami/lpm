const aws = require('aws-sdk');
const config = require('./config');

const ses = new aws.SES({
  ...config.auth,
  region: config.ses.region,
});

const s3 = new aws.S3(config.s3);

module.exports = {
  ses,
  s3
};
