const HttpError = require('./HttpError');
const BadRequestError = require('./BadRequestError');
const ConflictError = require('./ConflictError');
const ForbiddenError = require('./ForbiddenError');
const NotFoundError = require('./NotFoundError');
const ServerError = require('./ServerError');
const UnauthorizedError = require('./UnauthorizedError');
const UnprocessableEntityError = require('./UnprocessableEntityError');

module.exports = {
  HttpError,
  BadRequestError,
  ConflictError,
  ForbiddenError,
  NotFoundError,
  ServerError,
  UnauthorizedError,
  UnprocessableEntityError,
};
