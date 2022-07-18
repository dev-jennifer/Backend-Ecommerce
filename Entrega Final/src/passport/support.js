const config = '../utils/config.js',
  jwt = require('jsonwebtoken');

function isAdmin(req, res, next) {
  if (req.isAuthenticated() && req.user.membershipID === 1) {
    return next();
  }
     res.status(403).json({
      error: 'se requiere autenticacion  de admin para acceder a este recurso'
    });
 
}


//  // Function for generating jwt tokens
// const generateJwtToken = (user) => {
//       const token = jwt.sign(user, config.JWT.SECRET, {
//         expiresIn: '1d',
//       });
//       console.log("TOk", token)
//       return token;
//     };

// function generateToken(user) {

//   const token= jwt.sign({ data: user }, config.JWT.SECRET, { expiresIn: '10m' });
//   console.log("TOK",token)
//   return token
// }

// function auth(req, res, next) {
//   const authHeader =
//     req.headers['authorization'] || req.headers['Authorization'] || '';
//   console.log('req.headers', req.headers);
//   console.log('Authheader', authHeader);

//   if (!authHeader) {
//     return res.status(401).json({
//       error: 'se requiere autenticacion para acceder a este recurso',
//       detalle: 'no se encontró token de autenticación',
//     });
//   }

//   const token = authHeader.split(' ')[1];

//   if (!token) {
//     return res.status(401).json({
//       error: 'se requiere autenticacion para acceder a este recurso',
//       detalle: 'formato de token invalido!',
//     });
//   }

//   try {
//     req.user = jwt.verify(token, config.JWT.SECRET);
//   } catch (err) {
//     return res.status(403).json({
//       error: 'token invalido',
//       detalle: 'nivel de acceso insuficiente para el recurso solicitado',
//     });
//   }

//   next();
// }


module.exports = { isAdmin};
