const httpStatusCodes = require('http-status-codes');
const { HttpError } = require('../common/errors');
const { logger } = require('../common/logger');

const handleError = async (error, req, res, next) => {
  logger.error(error);
  if (error instanceof HttpError) {
    res.status(error.statusCode).json({ err: error });
    return;
  }

  res.status(httpStatusCodes.INTERNAL_SERVER_ERROR).json({ err: error });
};

module.exports = {
  handleError,
};
