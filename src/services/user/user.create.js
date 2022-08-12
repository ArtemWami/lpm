const { User } = require('../../models');

const create = async (
  name,
  lastName,
  email,
  companyName,
  city,
  province,
  postalCode,
  phone,
  password,
  role,
  address,
  color
) =>
  await User.create({
    name,
    lastName,
    email,
    companyName,
    city,
    province,
    postalCode,
    phone,
    password,
    role,
    address,
    color
  });



module.exports = {
  create
};
