const config = require('./config');
const { s3 } = require('./client');

const removeImage = (fileName) => {

  const params = {
    Bucket: process.env.S3_BUCKET,
    Key: fileName
  }

  s3.deleteObject(params, (err, data) => {
    if (err) console.log(err, err.stack);                       // an error occurred
    else console.log({ msg: `REMOVED IMG ${fileName}`, data }); // successful response
  });
}


module.exports = {
  removeImage
};
