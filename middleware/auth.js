const jwt = require('jsonwebtoken');
const User = require('../models/user');

const isAuth = (req, res, next) => {
    const token = req.cookies.jwt;

    if (token) {
        jwt.verify(token, 'hello', (err, decodedToken) => {
            if (err) {
              console.log(err.message);
              res.redirect('/login');
            } else {
              console.log(decodedToken);
              next();
            }
          });
    } else {
        res.redirect('/login');
    }
};

const checkUser = (req, res, next) => {
  const token = req.cookies.jwt;
  if (token) {
    jwt.verify(token, 'hello', async (err, decodedToken) => {
      if (err) {
        res.locals.user = null;
        next();
      } else {
        let user = await User.findById(decodedToken.id);
        res.locals.user = user;
        next();
      }
    });
  } else {
    res.locals.user = null;
    next();
  }
};

  
module.exports = { isAuth, checkUser};
    
