const { User } = require('../../models');

const restore = async (userId) => await User.restore({ where: { id: userId } });

module.exports = {
  restore
};
