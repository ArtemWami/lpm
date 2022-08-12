const { flatten } = require('../src/helpers/array');

const tableName = 'locations_tasks';
const locations = [
  { location_id: 1 },
  { location_id: 2 }
  ];
const tasks = [{ task_id: 1 }, { task_id: 2 }, { task_id: 3 }, { task_id: 4 }, { task_id: 5 }];
let locationTasks = locations.map(({ location_id }) =>
  tasks.map(({ task_id }) => ({
    location_id,
    task_id,
    created_at: new Date(),
    updated_at: new Date(),
  })),
);

locationTasks = flatten(locationTasks);

const up = (queryInterface) => {
  return queryInterface.bulkInsert(tableName, locationTasks);
};

const down = (queryInterface) => {
  return queryInterface.bulkDelete(tableName, {
    location_id: locationTasks.map(({ location_id }) => location_id),
  });
};

module.exports = {
  up,
  down,
};
