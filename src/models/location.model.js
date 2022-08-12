module.exports = (sequelize, DataTypes) => {
  const Locations = sequelize.define(
    'Locations',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        field: 'location_id',
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      address: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      city: {
        type: DataTypes.STRING,
        allowNull: true,
        field: 'city',
      },
      province: {
        type: DataTypes.STRING,
        allowNull: true,
        field: 'province',
      },
      postalCode: {
        type: DataTypes.STRING,
        allowNull: true,
        field: 'postal_code',
      },
      active: {
        type: DataTypes.STRING,
        defaultValue: 'active',
        allowNull: true,
        field: 'active',
      },
      comment: {
        type: DataTypes.STRING,
        allowNull: true,
        field: 'comment',
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
      tableName: 'locations',
      paranoid: true,
      timestamps: true,
      freezeTableName: true,
    },
  );

  Locations.associate = ({ User, UserLocations, LocationsTasks, Task, Job, ImagesForComments }) => {
    Locations.belongsToMany(User, {
      through: UserLocations,
      foreignKey: 'locationId',
      as: 'users',
    });

    Locations.belongsToMany(Task, {
      through: LocationsTasks,
      foreignKey: 'locationId',
      as: 'tasks',
    });

    Locations.hasMany(Job, {
      foreignKey: 'locationId',
      as: 'jobs',
    });

    Locations.hasMany(ImagesForComments, {
      foreignKey: 'locationId',
      as: 'img'
    });
  };

  return Locations;
};
