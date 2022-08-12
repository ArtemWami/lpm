const httpStatusCodes = require('http-status-codes');
const { validationResult } = require('express-validator');

const validationResponse = () => (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(httpStatusCodes.UNPROCESSABLE_ENTITY).json({
      status: httpStatusCodes.UNPROCESSABLE_ENTITY,
      errors: errors.array(),
    });

    return;
  }

  next();
};

module.exports = { validationResponse };
