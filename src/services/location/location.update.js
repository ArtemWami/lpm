const { Locations, UserLocations } = require('../../models');

const update = (id, address, name, city, province, postalCode) => {
  return Locations.update({ address, name, city, province, postalCode }, { where: { id } });
}

const destroyUserAssign = (currentUsersAssigned, locationId) => {
  currentUsersAssigned.map(async (userAssigned) => {
    const userId = userAssigned.id;
    await UserLocations.destroy({ where: { locationId, userId }, force: true });
  });
}

const userAssign = (users, locationId) => {
  users.map(async (userId) => {
    await UserLocations.create({ locationId, userId });
  });
}

const setInactive = (id) => {
  return Locations.update({ active: 'inactive' }, { where: { id } });
}

module.exports = {
  update,
  destroyUserAssign,
  userAssign,
  setInactive
};
