module.exports = (sequelize, DataTypes) => {
    const UserLocations = sequelize.define(
        'UserLocations',
        {
            userId: {
                type: DataTypes.INTEGER,
                allowNull: false,
                field: 'user_id',
                // references: { model: 'User', key: 'id' },
                primaryKey: true,
            },
            locationId: {
                type: DataTypes.INTEGER,
                allowNull: false,
                field: 'location_id',
                // references: { model: 'Locations', key: 'id' },
                primaryKey: true,
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
            tableName: 'user_locations',
            paranoid: true,
            timestamps: true,
            freezeTableName: true,
        },
    );

    return UserLocations;
};
