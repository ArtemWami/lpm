const httpStatusCodes = require('http-status-codes');
const HttpError = require('./HttpError');

class UnauthorizedError extends HttpError {
  constructor({ message, payload } = {}) {
    super(message, httpStatusCodes.UNAUTHORIZED, payload);
  }
}

module.exports = UnauthorizedError;
