const httpStatusCodes = require('http-status-codes');
const HttpError = require('./HttpError');

class ForbiddenError extends HttpError {
  constructor({ message, payload } = {}) {
    super(message, httpStatusCodes.FORBIDDEN, payload);
  }
}

module.exports = ForbiddenError;
