function isAdmin(req, res, next) {
  if (req.isAuthenticated() && req.user.membershipID === 1) {
    return next();
  }
     res.redirect(403, '/error');
 
}
module.exports = isAdmin;