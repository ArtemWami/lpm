const jwt = require('jsonwebtoken');
const { User } = require('./../models');

const checkAuthorization = async (req, res, next) => {
  const token = req.headers.authorization;

  // CHECK AUTHORIZE
  if(!token) return res.status(401).send('UNAUTHORIZED');

  if (!req.state) {
    req.state = {};
  }

  req.state.user = await jwt.verify(token, process.env.JWT_KEY);

  const { id } = req.state.user;
  const user = await User.findOne({ where: { id } });
  if(!user || user.active === 'inactive') return res.status(401).send('UNAUTHORIZED');

  return next();
};

const rolePermission = (roles) => (req, res, next) => {
  const { user } = req.state;
  return roles.indexOf(user.role) > -1 ? next() : res.status(401).json("User haven`t permissions");
};

module.exports = {
  checkAuthorization,
  rolePermission,
};
