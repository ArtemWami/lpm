const { User } = require('../../models');

const findOneByEmailForce = async (email) =>
  await User.findOne({ where: { email }, paranoid: false });

const findOneById = async (id) => await User.findOne({ where: { id } });

const findOneByIdForce = async (id) =>
  await User.findOne({ where: { id }, paranoid: false });

const findOneByIdActive = async (id) =>
  await User.findOne({ where: { id, active: 'active' } });


module.exports = {
  findOneByEmailForce,
  findOneById,
  findOneByIdForce,
  findOneByIdActive
};
