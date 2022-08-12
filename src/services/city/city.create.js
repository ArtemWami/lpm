const { CityList } = require('../../models');

const create = async (
  name
) =>
  await CityList.create({
    name
  });



module.exports = {
  create
};
