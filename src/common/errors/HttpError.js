const httpStatusCodes = require('http-status-codes');

class HttpError extends Error {
  constructor(message, statusCode, payload) {
    super();
    Error.captureStackTrace(this, this.constructor);
    this.name = this.constructor.name;
    this.message = message || httpStatusCodes.getReasonPhrase(statusCode);
    this.statusCode = statusCode;
    this.payload = payload;
  }
}

module.exports = HttpError;
