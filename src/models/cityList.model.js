module.exports = (sequelize, DataTypes) => {
  const CityList = sequelize.define(
    'CityList',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        field: 'city_id',
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
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
      }
    },
    {
      tableName: 'city_list',
      paranoid: true,
      timestamps: true,
      freezeTableName: true,
    },
  );

  return CityList;
};
