module.exports = (sequelize, DataTypes) => {
    const TaskStatus = sequelize.define(
        'TaskStatus',
        {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                field: 'task_status_id',
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
            tableName: 'task_statuses',
            paranoid: true,
            timestamps: true,
            freezeTableName: true,
        },
    );

    return TaskStatus;
};
