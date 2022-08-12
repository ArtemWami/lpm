const tableName = 'task_places';
const taskPlaces = [
  {
    name: 'Roads',
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    name: 'Sidewalks',
    created_at: new Date(),
    updated_at: new Date(),
  },
];

const up = (queryInterface) => {
  return queryInterface.bulkInsert(tableName, taskPlaces);
};

const down = (queryInterface) => {
  return queryInterface.bulkDelete(tableName, {
    name: taskPlaces.map(({ name }) => name),
  });
};

module.exports = {
  up,
  down,
};
