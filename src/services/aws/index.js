const { upload } = require('./aws.upload');
const { removeImage } = require('./aws.S3.remove');

module.exports = {
  upload,
  removeImage
};
