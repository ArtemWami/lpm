const tableName = 'jobs';

const up = async (queryInterface, Sequelize) => {
  return queryInterface.addColumn(tableName, 'comment', {
    type: Sequelize.STRING,
    allowNull: true,
  });
};

const down = async (queryInterface) => {
  return queryInterface.removeColumn(tableName, 'comment');
};

module.exports = {
  up,
  down,
};
