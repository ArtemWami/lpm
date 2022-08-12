const express = require('express');
const { checkAuthorization, rolePermission } = require('./../../../middlewares/authorization');
const jobsController = require('../controllers/jobs.controller');
const { wrap } = require('./../../../helpers/wrap');
const { User } = require('./../../../models');
const router = express.Router();
const validateJobService = require('./../../../middlewares/validation/expressValidation/jobs');
const { validationResponse } = require('./../../../middlewares/validation/expressValidation/validationBase');
const multer = require("multer");
// let upload  = multer({ storage: multer.memoryStorage() });
let { upload } = require('./../../../services/aws');

router.post(
  '/locations/:locationId/jobs',
  checkAuthorization,
  rolePermission([User.ROLE_WORKER, User.ROLE_SUPERVISOR, User.ROLE_MASTER]),
  validateJobService.jobCreation(),
  validationResponse(),
  wrap(jobsController.create)
);

router.get('/jobs',
  checkAuthorization,
  rolePermission([User.ROLE_WORKER, User.ROLE_SUPERVISOR, User.ROLE_MASTER]),
  wrap(jobsController.findAll));

router.patch('/jobs/:jobId',
  checkAuthorization,
  rolePermission([User.ROLE_WORKER, User.ROLE_SUPERVISOR, User.ROLE_MASTER]),
  validateJobService.jobUpdate(),
  validationResponse(),
  wrap(jobsController.update));

router.patch(
  '/jobs/:jobId/tasks',
  checkAuthorization,
  rolePermission([User.ROLE_WORKER, User.ROLE_SUPERVISOR, User.ROLE_MASTER]),
  wrap(jobsController.updateTasks),
);

router.get('/jobs/active',
  checkAuthorization,
  rolePermission([User.ROLE_WORKER, User.ROLE_SUPERVISOR, User.ROLE_MASTER]),
  wrap(jobsController.findOneActive));

router.get('/jobs/:jobId',
  checkAuthorization,
  rolePermission([User.ROLE_MASTER]),
  wrap(jobsController.findOneByJobId));

router.delete('/jobs/:jobId',
  checkAuthorization,
  rolePermission([User.ROLE_WORKER, User.ROLE_SUPERVISOR, User.ROLE_MASTER]),
  validateJobService.jobId(),
  validationResponse(),
  wrap(jobsController.destroy));

router.post(
  '/jobs/:jobId/comment',
  checkAuthorization,
  rolePermission([User.ROLE_WORKER, User.ROLE_SUPERVISOR, User.ROLE_MASTER]),
  wrap(jobsController.addComment)
);

router.post(
  '/jobs/:jobId/image',
  checkAuthorization,
  rolePermission([User.ROLE_WORKER, User.ROLE_SUPERVISOR, User.ROLE_MASTER]),
  wrap(jobsController.joinImg)
);

router.patch(
  '/jobs/:jobId/comment',
  checkAuthorization,
  rolePermission([User.ROLE_WORKER, User.ROLE_SUPERVISOR, User.ROLE_MASTER]),
  wrap(jobsController.updateComment)
);

router.post(
  '/jobs/upload',
  checkAuthorization,
  rolePermission([User.ROLE_WORKER, User.ROLE_SUPERVISOR, User.ROLE_MASTER]),
  upload.array('commentImg', 15),
  wrap(jobsController.uploadToAWSBucket)
);

router.post(
  '/jobs/upload/:jobId',
  checkAuthorization,
  rolePermission([User.ROLE_WORKER, User.ROLE_SUPERVISOR, User.ROLE_MASTER]),
  upload.array('commentImg', 15),
  wrap(jobsController.uploadToAWSBucket)
);

router.delete(
  '/jobs/img/:imgId',
  checkAuthorization,
  rolePermission([User.ROLE_WORKER, User.ROLE_SUPERVISOR, User.ROLE_MASTER]),
  wrap(jobsController.removeImg)
);


module.exports = router;
