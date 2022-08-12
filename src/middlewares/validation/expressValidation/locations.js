const { body, param } = require("express-validator");
const { User } = require("./../../../models");

const id = () => body("id").isInt();
const locationId = () => param("locationId").isInt();
const locationIdBody = () => body("locationsIds").isArray();
const userId = () => body("userId").isInt();

const address = () => body("address").isString().isLength({ min: 0 });
const name = () => body("name").isString().isLength({ min: 0 });
const city = () => body("city").isString().isLength({ min: 0 });
const province = () => body("province").isString().isLength({ min: 0 });
const postalCode = () => body("postalCode").isString().isLength({ min: 0 });

// ========================= ENTITY ==============================
/**
 * need to add users array
 * */
const location = () => [
  address(),
  name().optional(),
  city().optional(),
  province().optional(),
  postalCode().optional()
];

const locationOptional = () => [
    address().optional(),
    name().optional(),
    city().optional(),
    province().optional(),
    postalCode().optional()
];

const locationAssign = () => [
  userId(),
  locationIdBody()
];

module.exports = {
  id,
  locationId,
  name,
  city,
  province,
  postalCode,
  address,
  location,
  locationOptional,
  locationAssign
};
