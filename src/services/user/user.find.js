const { User, Locations } = require("../../models");
const userAttributes = [
  "id", "name", "lastName", "color",
  "email", "role", "companyName", "address",
  "city", "province", "postalCode", "phone",
  "active"
];

const locationAttributes = ["id", "name", "address", "city", "province", "postalCode", "active"];

const locationInclude = {
  model: Locations,
  as: "locations",
  through: { attributes: [] },
  attributes: locationAttributes
};

const findOne = async (id) => await User.findOne({
  where: { id },
  attributes: userAttributes,
  include: [locationInclude]
});

const findAll = async () =>
  await User.findAll({
    attributes: userAttributes,
    include: [locationInclude]
  });

module.exports = {
  findOne,
  findAll
};
