const { body, param } = require('express-validator');

const locationId = () => param('locationId').isInt();
const jobId = () => param('jobId').isInt();

const startDate = () => body('startDate').isString().isLength({ min: 1 });
const endDate = () => body('endDate').isString().isLength({ min: 1 }).optional();

// ========================= ENTITY ==============================

const jobCreation = () => [
  locationId(),
  startDate(),
  endDate()
];

const jobUpdate = () => [
  jobId().optional(),
  startDate().optional(),
  // endDate()
];

module.exports = {
  locationId,
  jobId,
  startDate,
  endDate,
  jobCreation,
  jobUpdate
}
