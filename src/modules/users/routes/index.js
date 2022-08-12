const express = require('express');
const router = express.Router();
const userController = require('../controllers/userCRUD');
const userAuthController = require('../controllers/auth');
const { checkAuthorization, rolePermission } = require('./../../../middlewares/authorization');
const { wrap } = require('./../../../helpers/wrap');
const { User } = require('./../../../models');
const validateAuthService = require('./../../../middlewares/validation/expressValidation/users');
const { validationResponse } = require('./../../../middlewares/validation/expressValidation/validationBase');
const multer = require("multer");
let upload  = multer({ storage: multer.memoryStorage() });

// CRUD
router.get('/',
  checkAuthorization,
  rolePermission([User.ROLE_WORKER, User.ROLE_SUPERVISOR, User.ROLE_MASTER]),
  userController.get);

router.get('/listing',
  checkAuthorization,
  rolePermission([User.ROLE_MASTER]),
  userController.listing);

router.post('/',
  checkAuthorization,
  rolePermission([User.ROLE_MASTER]),
  validateAuthService.userOptional(),
  validationResponse(),
  userController.add);

router.patch('/',
  checkAuthorization,
  rolePermission([User.ROLE_WORKER, User.ROLE_SUPERVISOR, User.ROLE_MASTER]),
  validateAuthService.userOptional(),
  validationResponse(),
  userController.update);

router.delete('/',
  checkAuthorization,
  rolePermission([User.ROLE_WORKER, User.ROLE_SUPERVISOR, User.ROLE_MASTER]),
  validateAuthService.id(),
  validationResponse(),
  userController.remove);

router.post('/restore/:userId',
  checkAuthorization,
  rolePermission([User.ROLE_MASTER]),
  validateAuthService.userIdParam(),
  validationResponse(),
  userController.restore);

// AUTH
router.post('/pass', validateAuthService.auth(), validationResponse(), userAuthController.setPassword);
router.post('/login', validateAuthService.auth(), validationResponse(), userAuthController.login);
router.post('/forgot', validateAuthService.email(), validationResponse(), userAuthController.forgotPassword);

router.post('/upload1', upload.single('userFile'), userAuthController.upload);
router.post('/upload1/assign', upload.single('userFile'), userAuthController.uploadAssign);

router.get('/:userId',
  checkAuthorization,
  rolePermission([User.ROLE_MASTER]),
  validateAuthService.userIdParam(),
  validationResponse(),
  userController.get);

module.exports = router;
