const multer = require('multer');
const multerS3 = require('multer-s3');
const config = require('./config');
const { s3 } = require('./client');
const { generateImageKey, imageFileFilter } = require('./utils');

const storage = multerS3({
  s3,
  bucket: config.s3.bucket,
  acl: 'public-read',
  contentType: multerS3.AUTO_CONTENT_TYPE,
  key(req, file, cb) {
    cb(null, generateImageKey(file));
  },
});

const upload = multer({
  storage
  // fileFilter: imageFileFilter,
  // limits: { fileSize: 5 * 1024 * 1024 },
});

module.exports = {
  upload
};
