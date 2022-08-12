const tableName = 'tasks';
const tasks = [
  {
    name: 'plowed',
    task_place_id: 1,
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    name: 'plowed',
    task_place_id: 2,
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    name: 'salted',
    task_place_id: 1,
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    name: 'salted',
    task_place_id: 2,
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    name: 'Ice Melter Applied',
    task_place_id: 2,
    created_at: new Date(),
    updated_at: new Date(),
  },
];

const up = (queryInterface) => {
  return queryInterface.bulkInsert(tableName, tasks);
};

const down = (queryInterface) => {
  return queryInterface.bulkDelete(tableName, {
    name: tasks.map(({ name }) => name),
  });
};

module.exports = {
  up,
  down,
};
