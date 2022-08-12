module.exports = (sequelize, DataTypes) => {
  const LocationsTasks = sequelize.define(
    'LocationsTasks',
    {
      locationId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        field: 'location_id',
      },
      taskId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        field: 'task_id',
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        field: 'created_at',
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        field: 'updated_at',
      },
      deletedAt: {
        type: DataTypes.DATE,
        allowNull: true,
        field: 'deleted_at',
      },
    },
    {
      tableName: 'locations_tasks',
      paranoid: false,
      timestamps: false,
      freezeTableName: true,
    },
  );

  return LocationsTasks;
};
