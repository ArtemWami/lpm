const httpStatusCodes = require('http-status-codes');
const HttpError = require('./HttpError');

class UnprocessableEntityError extends HttpError {
  constructor({ message, payload } = {}) {
    super(message, httpStatusCodes.UNPROCESSABLE_ENTITY, payload);
  }
}

module.exports = UnprocessableEntityError;
