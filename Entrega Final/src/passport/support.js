const config = '../utils/config.js',
  jwt = require('jsonwebtoken');

function isAdmin(req, res, next) {
  if (req.isAuthenticated() && req.user.membershipID === 1) {
    return next();
  }
  res.redirect(403, '/error');
}

function generateToken(user) {
  return jwt.sign({ data: user }, config.JWT.SECRET, { expiresIn: '10m' });
}

module.exports = {isAdmin,generateToken};
