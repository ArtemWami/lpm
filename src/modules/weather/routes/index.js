const express = require('express');
const router = express.Router();
const weatherController = require('../controllers/getCurrentWeather');
// const userAuthController = require('../controllers/auth');
const { checkAuthorization, rolePermission } = require('./../../../middlewares/authorization');
// const { wrap } = require('./../../../helpers/wrap');
const { User } = require('./../../../models');
// const validateAuthService = require('./../../../middlewares/validation/expressValidation/users');
// const { validationResponse } = require('./../../../middlewares/validation/expressValidation/validationBase');

// CRUD
router.get('/',
  checkAuthorization,
  rolePermission([User.ROLE_MASTER]),
  weatherController.get);

module.exports = router;
