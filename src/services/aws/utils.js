const { v4: uuidv4, v1: uuidv1 } = require('uuid');

const generateKey = () => `${uuidv1()}${uuidv4()}`.replace(/-/g, '');
const generateImageKey = (image, prefix = '') =>
  `${prefix}${generateKey()}.${image.mimetype.split('/')[1]}`;

const IMAGE_MIME_TYPE_RE = /^image\/(jpe?g|png)$/;
const imageFileFilter = (req, image, cb) => {
  if (!IMAGE_MIME_TYPE_RE.test(image.mimetype)) {
    return cb(new Error('Incorrect file provided'));
  }

  return cb(null, true);
};

module.exports = {
  generateKey,
  generateImageKey,
  imageFileFilter,
};
