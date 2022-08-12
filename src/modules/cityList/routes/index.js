const express = require('express');
const router = express.Router();
const cityListController = require('../controllers/cityListCRUD');
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
  cityListController.get);

router.post('/',
  checkAuthorization,
  rolePermission([User.ROLE_MASTER]),
  cityListController.add);

router.patch('/',
  checkAuthorization,
  rolePermission([User.ROLE_MASTER]),
  cityListController.update);

router.delete('/',
  checkAuthorization,
  rolePermission([User.ROLE_MASTER]),
  cityListController.remove);

module.exports = router;
