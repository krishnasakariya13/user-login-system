const jwt = require('jsonwebtoken');

const signAccess = (user) => 
  jwt.sign({ id: user._id, username: user.username }, process.env.JWT_ACCESS_SECRET, {
    expiresIn: process.env.ACCESS_EXPIRES || '15m',
  });

const signRefresh = (user) => 
  jwt.sign({ id: user._id, username: user.username }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: process.env.REFRESH_EXPIRES || '7d',
  });

module.exports = { signAccess, signRefresh };  