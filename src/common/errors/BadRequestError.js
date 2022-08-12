const httpStatusCodes = require('http-status-codes');
const HttpError = require('./HttpError');

class BadRequestError extends HttpError {
  constructor({ message, payload } = {}) {
    super(message, httpStatusCodes.BAD_REQUEST, payload);
  }
}

module.exports = BadRequestError;
