const fs = require('fs');
const Sequelize = require('sequelize');
const exists = require('./extensions/exists');
const upsertWhere = require('./extensions/upsertWhere');
const config = require('./config');

Sequelize.Model.upsertWhere = upsertWhere;
Sequelize.Model.exists = exists;

const sequelize = new Sequelize(
    config.database,
    config.username,
    config.password,
    {
        host: config.host,
        port: config.port,
        dialect: "postgres",
        logging: false
    }
);


const models = fs
    .readdirSync(__dirname)
    .filter((file) => file.endsWith('model.js'))
    .reduce((acc, file) => {
        const model = require(`./${file}`)(sequelize, Sequelize.DataTypes);
        acc[model.name] = model;
        return acc;
    }, {});

Object.keys(models).forEach((name) => {
    if (models[name].associate) {
        models[name].associate(models);
    }
});

models.sequelize = sequelize;
models.Sequelize = Sequelize;
models.Op = Sequelize.Op;

module.exports = models;
