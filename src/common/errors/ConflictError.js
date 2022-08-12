const httpStatusCodes = require('http-status-codes');
const HttpError = require('./HttpError');

class ConflictError extends HttpError {
  constructor({ message, payload } = {}) {
    super(message, httpStatusCodes.CONFLICT, payload);
  }
}

module.exports = ConflictError;
