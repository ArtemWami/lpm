module.exports = (sequelize, DataTypes) => {
    const JobsTasks = sequelize.define(
        'JobsTasks',
        {
            jobId: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                field: 'job_id',
            },
            taskId: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                field: 'task_id',
            },
            taskStatusId: {
                type: DataTypes.INTEGER,
                allowNull: false,
                field: 'task_status_id',
            }
        },
        {
            tableName: 'jobs_tasks',
            paranoid: false,
            timestamps: false,
            freezeTableName: true,
        },
    );

    JobsTasks.TASK_STATUS_ID_YES = 1;
    JobsTasks.TASK_STATUS_ID_NO = 2;

    JobsTasks.associate = ({TaskStatus}) => {
        JobsTasks.belongsTo(TaskStatus, {
            foreignKey: 'taskStatusId',
            as: 'taskStatus',
        });
    }

    return JobsTasks;
};
