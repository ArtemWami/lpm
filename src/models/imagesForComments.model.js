module.exports = (sequelize, DataTypes) => {
  const ImagesForComments = sequelize.define(
    'ImagesForComments',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        field: 'img_id',
      },
      jobId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        field: 'job_id',
      },
      locationId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        field: 'location_id',
      },
      fileName: {
        type: DataTypes.STRING,
        allowNull: true,
        field: 'file_name',
      },
      imgUrl: {
        type: DataTypes.STRING,
        allowNull: true,
        field: 'img_url',
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
      tableName: 'images_for_comments',
      paranoid: true,
      timestamps: true,
      freezeTableName: true,
    },
  );

  ImagesForComments.associate = ({Job, ImagesForComments, Locations}) => {
    ImagesForComments.belongsTo(Job, {
      foreignKey: 'jobId',
      as: 'jobs',
    });

    ImagesForComments.belongsTo(Locations, {
      foreignKey: 'locationId',
      as: 'locations',
    });
  }

  return ImagesForComments;
};
