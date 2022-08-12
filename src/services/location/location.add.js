const { Locations, UserLocations, Task, LocationsTasks } = require('../../models');

const add = (address, name, city, province, postalCode) => {
  return Locations.create({ address, name, city, province, postalCode });
}

const bulkAssign = async (users, locationId) => {
  const bulkAssign = await users.map((userId) => {
    return { userId, locationId }
  });
  return await UserLocations.bulkCreate(bulkAssign);
}

const bulkCreateLocationTasks = async (locationId) => {
  const tasks =  await Task.findAll({ attributes: ['id'] });
  const locationsTasks = await tasks.map((task) => {
    return{
      locationId,
      taskId: task.id,
      createdAt: new Date(),
      updatedAt: new Date()
    }
  });

  return await LocationsTasks.bulkCreate(locationsTasks);
}

module.exports = {
  add,
  bulkAssign,
  bulkCreateLocationTasks
};
