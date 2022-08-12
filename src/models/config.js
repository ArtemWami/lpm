require('../../config');

const { DBNAME, DBUSER, DBPASSWORD, DBPORT, DBHOST, DBDIALECT = 'postgres' } = process.env;

module.exports = {
    migrationStorageTableName: 'sequelize_meta',
    host: DBHOST,
    port: DBPORT,
    username: DBUSER,
    password: DBPASSWORD,
    database: DBNAME,
    dialect: DBDIALECT,
    logging: false,
};
