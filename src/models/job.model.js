const { Op } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    const Job = sequelize.define(
        'Job',
        {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                field: 'job_id',
            },
            userId: {
                type: DataTypes.INTEGER,
                allowNull: false,
                field: 'user_id',
            },
            locationId: {
                type: DataTypes.INTEGER,
                allowNull: false,
                field: 'location_id',
            },
            startDate: {
                type: DataTypes.DATE,
                allowNull: false,
                field: 'start_date',
            },
            endDate: {
                type: DataTypes.DATE,
                allowNull: true,
                field: 'end_date',
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
            }
        },
        {
            tableName: 'jobs',
            paranoid: true,
            timestamps: true,
            freezeTableName: true,
            scopes:{
                active:{
                  subQuery: false,
                  where:{ '$tasks.task_id$': {[Op.eq]: null}},
                  include: {
                    association: 'tasks',
                    through: { attributes: [] },
                    required: false
                  }
                }
            }
        }
    );

    Job.associate = ({Task, JobsTasks, User, Locations, ImagesForComments}) => {
        Job.belongsTo(Locations, {
            foreignKey: 'locationId',
            as: 'location',
        });

        Job.belongsTo(User, {
            foreignKey: 'userId',
            as: 'user',
        });

        Job.belongsToMany(Task, {
            through: JobsTasks,
            foreignKey: 'jobId',
            as: 'tasks',
        });

        Job.hasMany(ImagesForComments, {
            foreignKey: 'jobId',
            as: 'img'
        });
    }

    return Job;
};
