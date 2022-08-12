const { promisify } = require('util');
const { compare, hash } = require('bcrypt');

const hashPromise = promisify(hash);
const hashPassword = (password, salt = 0x101) => hashPromise(password, salt);


module.exports = {
  hashPassword,
  comparePassword: compare,
};
