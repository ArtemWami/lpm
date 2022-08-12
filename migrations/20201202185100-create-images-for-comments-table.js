const tableName = 'images_for_comments';

const up = async (queryInterface, DataTypes) => {
  return queryInterface.createTable(tableName, {
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
    }
  });
};

const down = (queryInterface) => {
  return queryInterface.dropTable(tableName);
};

module.exports = {
  up,
  down,
};
