const httpStatusCodes = require('http-status-codes');
const HttpError = require('./HttpError');

class ServerError extends HttpError {
  constructor({ message, payload } = {}) {
    super(message, httpStatusCodes.INTERNAL_SERVER_ERROR, payload);
  }
}

module.exports = ServerError;
