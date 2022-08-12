const { findOne, findAll } = require('./user.find');
const { findOneByEmailForce, findOneById, findOneByIdForce, findOneByIdActive } = require('./user.exist');
const { create } = require('./user.create');
const { update } = require('./user.update');
const { restore } = require('./user.restore');
const { getRandomInt, getRandomColor, saveRandomColors } = require('./user.colors');
const { countActiveUserByList } = require('./user.countActiveUserByList');

module.exports = {
  // user.find
  findOne,
  findAll,
  // user.exist
  findOneByEmailForce,
  findOneById,
  findOneByIdForce,
  findOneByIdActive,
  // user.create
  create,
  // user.update
  update,
  // user.restore
  restore,
  // user.color
  getRandomInt,
  getRandomColor,
  saveRandomColors,
  //user.countActiveUserByList
  countActiveUserByList
};
