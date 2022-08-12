const { body, param } = require('express-validator');
const { User } = require('./../../../models');

const id = () => {
  return body('id')
    .isInt()
}

const userId = () => {
  return body('userId')
    .isInt()
}

const userIdParam = () => {
  return param('userId')
    .isInt()
}

const email = () => {
  return body('email')
    .isString()
    .isEmail()
}

const password = () => {
  return body('password')
    .isString()
    .isLength({ min: 8, max: 32 })
}

const name = () => body('name').isString().isLength({ min: 0 });
const lastName = () => body('lastName').isString().isLength({ min: 0 });


const role = () => {
  return body('role')
    .isString()
    .isIn(User.ROLES)
};

const companyName = () => body('companyName').isString().isLength({ min: 0 });
const city = () => body('city').isString().isLength({ min: 0 });
const province = () => body('province').isString().isLength({ min: 0 });
const postalCode = () => body('postalCode').isString().isLength({ min: 0 });

const phone = () => body('phone')
  .if(body('phone').not().equals(''))
  .isString()
  .isMobilePhone(['en-CA', 'uk-UA']);

const address = () => body('address').isString().isLength({ min: 0 });


// ========================= ENTITY ==============================

const user = () => [
  name(),
  lastName(),
  email(),
  role(),
  companyName(),
  city(),
  province(),
  postalCode(),
  phone(),
  address(),
  password()
];

const userOptional = () => user().map((userParam) => userParam.optional());

const auth = () => [
  email(),
  password(),
];

module.exports = {
  id,
  userId,
  userIdParam,
  email,
  password,
  name,
  lastName,
  role,
  companyName,
  city,
  province,
  postalCode,
  phone,
  address,
  auth,
  user,
  userOptional
}
