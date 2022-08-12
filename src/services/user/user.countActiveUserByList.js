const { User, Op } = require('../../models');

const countActiveUserByList = async (users) =>
  await User.count({
    where: {
      id: { [Op.in]: users },
      active: 'active'
    }
  });

module.exports = {
  countActiveUserByList
};
