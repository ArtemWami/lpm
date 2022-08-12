const tableName = 'images_for_comments';

const up = async (queryInterface, Sequelize) => {
  return queryInterface.addColumn(tableName, 'location_id', {
    type: Sequelize.INTEGER,
    allowNull: true,
    field: 'location_id',
  });
};

const down = async (queryInterface) => {
  return queryInterface.removeColumn(tableName, 'location_id');
};

module.exports = {
  up,
  down,
};
