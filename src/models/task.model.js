module.exports = (sequelize, DataTypes) => {
  const Task = sequelize.define(
    'Task',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        field: 'task_id',
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      taskPlaceId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        field: 'task_place_id',
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
      tableName: 'tasks',
      paranoid: true,
      timestamps: true,
      freezeTableName: true,
    },
  );

  Task.associate = ({
    TaskPlace,
    Job,
    JobsTasks,
    Locations,
    LocationsTasks,
  }) => {
    Task.belongsTo(TaskPlace, {
      foreignKey: 'taskPlaceId',
      as: 'place',
    });

    Task.belongsToMany(Job, {
      through: JobsTasks,
      foreignKey: 'taskId',
      as: 'jobs',
    });

    Task.belongsToMany(Locations, {
      through: LocationsTasks,
      foreignKey: 'taskId',
      as: 'locations',
    });
  };

  return Task;
};
