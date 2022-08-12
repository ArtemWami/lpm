const {
  findOneAndCount,
  findOne,
  findAll,
  getLocationsById,
  findAndCountActiveLocations,
  includeTask,
  includeJobByUserId,
} = require('./location.find');

const { add, bulkAssign, bulkCreateLocationTasks } = require('./location.add');
const { update, destroyUserAssign, userAssign, setInactive } = require('./location.update');

module.exports = {
  // location.find
  findOneAndCount,
  findOne,
  findAll,
  getLocationsById,
  findAndCountActiveLocations,
  includeTask,
  includeJobByUserId,
  // add
  add,
  bulkAssign,
  bulkCreateLocationTasks,
  // update
  update,
  destroyUserAssign,
  userAssign,
  setInactive
};
