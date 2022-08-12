const { User } = require('../../models');

const update = async (
  id,
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
  active
) => await User.update(
  {
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
      active
  }, {
      where: { id }
  });


module.exports = {
  update
};
