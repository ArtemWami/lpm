const express = require('express');
const router = express.Router();
const locationController = require('../controllers/locationCRUD');
const locationCommentController = require('../controllers/locationComments');
const locationAssignController = require('../controllers/locationAssign');
const { checkAuthorization, rolePermission } = require('./../../../middlewares/authorization');
const { wrap } = require('./../../../helpers/wrap');
const { User } = require('./../../../models');
const multer = require("multer");
let upload  = multer({ storage: multer.memoryStorage() });
const validateLocationsService = require('./../../../middlewares/validation/expressValidation/locations');
const { validationResponse } = require('./../../../middlewares/validation/expressValidation/validationBase');
const awsService = require('./../../../services/aws');

// CRUD
router.get('/',
  checkAuthorization,
  rolePermission([User.ROLE_WORKER, User.ROLE_SUPERVISOR, User.ROLE_MASTER]),
  locationController.get);

router.post('/',
  checkAuthorization,
  rolePermission([User.ROLE_MASTER]),
  validateLocationsService.location(),
  validationResponse(),
  locationController.add);

router.patch('/',
  checkAuthorization,
  rolePermission([User.ROLE_MASTER]),
  validateLocationsService.id(),
  validateLocationsService.locationOptional(),
  validationResponse(),
  locationController.update);

router.delete('/',
  checkAuthorization,
  rolePermission([User.ROLE_MASTER]),
  validateLocationsService.id(),
  validationResponse(),
  locationController.remove);

// UPLOAD LOCATIONS
router.post('/awsUpload',
  upload.single('locationFile'),
  locationController.upload);

// UPLOAD ALL
router.post('/uploadAll',
  upload.single('locationFile'),
  locationController.uploadAllData);

// ASSIGN USER TO LOCATION
router.post('/assign',
  checkAuthorization,
  rolePermission([User.ROLE_MASTER]),
  validateLocationsService.locationAssign(),
  validationResponse(),
  locationAssignController.assignUserToLocation);

// ASSIGN USER TO LOCATION
router.post('/estrange',
  checkAuthorization,
  rolePermission([User.ROLE_MASTER]),
  validateLocationsService.locationAssign(),
  validationResponse(),
  locationAssignController.estrangeUserLocation);

// LISTING INFORMATION FOR ALL USERS
router.get('/listing',
  checkAuthorization,
  rolePermission([User.ROLE_WORKER, User.ROLE_SUPERVISOR, User.ROLE_MASTER]),
  locationController.listing);

router.get('/:locationId',
  checkAuthorization,
  validateLocationsService.locationId(),
  validationResponse(),
  rolePermission([User.ROLE_WORKER, User.ROLE_SUPERVISOR, User.ROLE_MASTER]),
  locationController.getById);

// COMMENTS
router.post(
  '/:locationId/comment',
  checkAuthorization,
  rolePermission([User.ROLE_WORKER, User.ROLE_SUPERVISOR, User.ROLE_MASTER]),
  wrap(locationCommentController.addComment)
);

router.patch(
  '/:locationId/comment',
  checkAuthorization,
  rolePermission([User.ROLE_WORKER, User.ROLE_SUPERVISOR, User.ROLE_MASTER]),
  wrap(locationCommentController.updateComment)
);

router.post(
  '/:locationId/image',
  checkAuthorization,
  rolePermission([User.ROLE_WORKER, User.ROLE_SUPERVISOR, User.ROLE_MASTER]),
  wrap(locationCommentController.joinImg)
);

router.post(
  '/upload/img',
  checkAuthorization,
  rolePermission([User.ROLE_WORKER, User.ROLE_SUPERVISOR, User.ROLE_MASTER]),
  awsService.upload.array('commentImg', 15),
  wrap(locationCommentController.uploadToAWSBucket)
);

router.delete(
  '/img/:imgId',
  checkAuthorization,
  rolePermission([User.ROLE_WORKER, User.ROLE_SUPERVISOR, User.ROLE_MASTER]),
  wrap(locationCommentController.removeImg)
);

module.exports = router;
