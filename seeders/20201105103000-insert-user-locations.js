const tableName = 'user_locations';
const userLocations = [
  {
    user_id: 1,
    location_id: 1,
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    user_id: 2,
    location_id: 2,
    created_at: new Date(),
    updated_at: new Date(),
  }
];

const up = (queryInterface) => {
  return queryInterface.bulkInsert(tableName, userLocations);
};

const down = (queryInterface) => {
  return queryInterface.bulkDelete(tableName, {
    user_id: userLocations.map(({ user_id }) => user_id),
  });
};

module.exports = {
  up,
  down,
};
