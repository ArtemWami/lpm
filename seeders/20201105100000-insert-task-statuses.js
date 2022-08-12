const tableName = 'task_statuses';
const taskStatuses = [
  {
    name: 'Yes',
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    name: 'No',
    created_at: new Date(),
    updated_at: new Date(),
  },
];

const up = (queryInterface) => {
  return queryInterface.bulkInsert(tableName, taskStatuses);
};

const down = (queryInterface) => {
  return queryInterface.bulkDelete(tableName, {
    name: taskStatuses.map(({ name }) => name),
  });
};

module.exports = {
  up,
  down,
};
