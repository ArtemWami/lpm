module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define(
        'User',
        {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                field: 'user_id',
            },
            name: {
              type: DataTypes.STRING,
              allowNull: false,
              field: 'name',
            },
            lastName: {
              type: DataTypes.STRING,
              allowNull: true,
              field: 'last_name',
            },
            email: {
                type: DataTypes.STRING,
                allowNull: false,
                field: 'email',
            },
            emailVerified: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: false,
                field: 'email_verified',
            },
            companyName: {
                type: DataTypes.STRING,
                allowNull: true,
                field: 'company_name',
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
            phone: {
                type: DataTypes.STRING,
                allowNull: true,
                field: 'phone',
            },
            password: {
                type: DataTypes.STRING,
                allowNull: true,
                field: 'password',
            },
            role: {
                type: DataTypes.STRING,
                allowNull: false,
                field: 'role',
            },
            address: {
              type: DataTypes.STRING,
              allowNull: true,
              field: 'address',
            },
            color: {
              type: DataTypes.STRING,
              allowNull: true,
              field: 'color',
            },
            active: {
              type: DataTypes.STRING,
              defaultValue: 'active',
              allowNull: true,
              field: 'active',
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
            tableName: 'users',
            paranoid: true,
            timestamps: true,
            freezeTableName: true,
        },
    );

    User.ROLE_MASTER = 'master';
    User.ROLE_SUPERVISOR = 'supervisor';
    User.ROLE_WORKER = 'worker';
    User.ROLES = [ User.ROLE_MASTER, User.ROLE_SUPERVISOR, User.ROLE_WORKER ];

    User.associate = ({Locations, UserLocations, Job}) => {
        User.belongsToMany(Locations, { through: UserLocations, foreignKey: 'userId', as: 'locations' });
        User.hasMany(Job, { foreignKey: 'userId', as: 'jobs' });
    }

    return User;
};
