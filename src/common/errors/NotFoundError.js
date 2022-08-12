const httpStatusCodes = require('http-status-codes');
const HttpError = require('./HttpError');

class NotFoundError extends HttpError {
  constructor({ message, payload } = {}) {
    super(message, httpStatusCodes.NOT_FOUND, payload);
  }
}

module.exports = NotFoundError;
