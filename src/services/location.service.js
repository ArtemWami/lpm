const {Locations: Location} = require('../models');

const findOne = (locationId, {include} = {}) =>
    Location.findOne({where: {id: locationId}, include});

module.exports = {
    findOne,
};
